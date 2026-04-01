const crypto = require('crypto');
const { query, withTransaction } = require('./db');

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function sanitizeUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at
  };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, row) {
  const hashToCompare = crypto.scryptSync(String(password), row.password_salt, 64);
  const storedHash = Buffer.from(row.password_hash, 'hex');
  return storedHash.length === hashToCompare.length && crypto.timingSafeEqual(storedHash, hashToCompare);
}

function getChatTitleFromMessage(message) {
  const cleaned = String(message || '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return 'New Chat';
  return cleaned.length > 48 ? `${cleaned.slice(0, 48).trim()}...` : cleaned;
}

function buildPasswordData(password) {
  const passwordData = hashPassword(password);
  return {
    passwordHash: passwordData.hash,
    passwordSalt: passwordData.salt
  };
}

async function createUser({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const passwordData = buildPasswordData(password);

  try {
    const result = await query(
      `
        INSERT INTO users (name, email, password_hash, password_salt)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, created_at
      `,
      [String(name || '').trim(), normalizedEmail, passwordData.passwordHash, passwordData.passwordSalt]
    );

    return sanitizeUser(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      const conflict = new Error('An account with that email already exists.');
      conflict.statusCode = 409;
      throw conflict;
    }

    throw error;
  }
}

async function authenticateUser({ email, password }) {
  const result = await query(
    `
      SELECT id, name, email, password_hash, password_salt, created_at
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [normalizeEmail(email)]
  );

  const row = result.rows[0];
  if (!row || !verifyPassword(password, row)) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  return sanitizeUser(row);
}

async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');

  await query(
    `
      INSERT INTO sessions (token, user_id)
      VALUES ($1, $2)
    `,
    [token, userId]
  );

  return token;
}

async function getUserBySessionToken(token) {
  if (!token) return null;

  const result = await withTransaction(async (client) => {
    const sessionResult = await client.query(
      `
        UPDATE sessions
        SET last_seen_at = NOW()
        WHERE token = $1
        RETURNING user_id
      `,
      [token]
    );

    const session = sessionResult.rows[0];
    if (!session) return null;

    const userResult = await client.query(
      `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = $1
        LIMIT 1
      `,
      [session.user_id]
    );

    return userResult.rows[0] ? sanitizeUser(userResult.rows[0]) : null;
  });

  return result;
}

async function destroySession(token) {
  if (!token) return;

  await query(
    `
      DELETE FROM sessions
      WHERE token = $1
    `,
    [token]
  );
}

async function createPasswordResetToken(email) {
  const normalizedEmail = normalizeEmail(email);
  const userResult = await query(
    `
      SELECT id, email
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [normalizedEmail]
  );

  const user = userResult.rows[0];
  if (!user) {
    return null;
  }

  const token = crypto.randomBytes(32).toString('hex');

  await withTransaction(async (client) => {
    await client.query(
      `
        DELETE FROM password_reset_tokens
        WHERE user_id = $1
      `,
      [user.id]
    );

    await client.query(
      `
        INSERT INTO password_reset_tokens (token, user_id, expires_at)
        VALUES ($1, $2, NOW() + INTERVAL '30 minutes')
      `,
      [token, user.id]
    );
  });

  return {
    token,
    userId: user.id,
    email: user.email
  };
}

async function resetPasswordWithToken(token, password) {
  const tokenResult = await query(
    `
      SELECT token, user_id, expires_at
      FROM password_reset_tokens
      WHERE token = $1
      LIMIT 1
    `,
    [String(token || '').trim()]
  );

  const resetEntry = tokenResult.rows[0];
  if (!resetEntry) {
    const error = new Error('This reset link is invalid or has already been used.');
    error.statusCode = 400;
    throw error;
  }

  if (new Date(resetEntry.expires_at).getTime() < Date.now()) {
    await query(
      `
        DELETE FROM password_reset_tokens
        WHERE token = $1
      `,
      [resetEntry.token]
    );

    const error = new Error('This reset link has expired. Please request a new one.');
    error.statusCode = 400;
    throw error;
  }

  const passwordData = buildPasswordData(password);

  await withTransaction(async (client) => {
    await client.query(
      `
        UPDATE users
        SET password_hash = $2, password_salt = $3
        WHERE id = $1
      `,
      [resetEntry.user_id, passwordData.passwordHash, passwordData.passwordSalt]
    );

    await client.query(
      `
        DELETE FROM password_reset_tokens
        WHERE user_id = $1
      `,
      [resetEntry.user_id]
    );

    await client.query(
      `
        DELETE FROM sessions
        WHERE user_id = $1
      `,
      [resetEntry.user_id]
    );
  });

  return { ok: true };
}

async function createChat(userId, firstMessage = '') {
  const result = await query(
    `
      INSERT INTO chats (user_id, title)
      VALUES ($1, $2)
      RETURNING id, title, created_at, updated_at
    `,
    [userId, getChatTitleFromMessage(firstMessage)]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function getChatForUser(chatId, userId, client = null) {
  const executor = client || { query };
  const result = await executor.query(
    `
      SELECT id, user_id, title, created_at, updated_at
      FROM chats
      WHERE id = $1 AND user_id = $2
      LIMIT 1
    `,
    [chatId, userId]
  );

  return result.rows[0] || null;
}

async function appendMessage(chatId, userId, role, content) {
  return withTransaction(async (client) => {
    const chat = await getChatForUser(chatId, userId, client);
    if (!chat) {
      const error = new Error('Chat not found.');
      error.statusCode = 404;
      throw error;
    }

    const messageResult = await client.query(
      `
        INSERT INTO messages (chat_id, role, content)
        VALUES ($1, $2, $3)
        RETURNING id, role, content, created_at
      `,
      [chatId, role, String(content || '')]
    );

    let nextTitle = chat.title;
    if (role === 'user' && (chat.title === 'New Chat' || !chat.title)) {
      nextTitle = getChatTitleFromMessage(content);
    }

    await client.query(
      `
        UPDATE chats
        SET title = $3, updated_at = NOW()
        WHERE id = $1 AND user_id = $2
      `,
      [chatId, userId, nextTitle]
    );

    const row = messageResult.rows[0];
    return {
      id: row.id,
      role: row.role,
      content: row.content,
      createdAt: row.created_at
    };
  });
}

async function updateChatTitle(chatId, userId, title) {
  const cleanedTitle = String(title || '').replace(/\s+/g, ' ').trim();
  if (!cleanedTitle) {
    const chat = await listMessagesForChat(chatId, userId);
    return {
      id: chat.id,
      title: chat.title
    };
  }

  const nextTitle = cleanedTitle.length > 60
    ? `${cleanedTitle.slice(0, 60).trim()}...`
    : cleanedTitle;

  const result = await query(
    `
      UPDATE chats
      SET title = $3, updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      RETURNING id, title
    `,
    [chatId, userId, nextTitle]
  );

  if (!result.rows[0]) {
    const error = new Error('Chat not found.');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: result.rows[0].id,
    title: result.rows[0].title
  };
}

async function listChatsForUser(userId) {
  const result = await query(
    `
      SELECT
        c.id,
        c.title,
        c.created_at,
        c.updated_at,
        COUNT(m.id)::int AS message_count
      FROM chats c
      LEFT JOIN messages m ON m.chat_id = c.id
      WHERE c.user_id = $1
      GROUP BY c.id
      ORDER BY c.updated_at DESC
    `,
    [userId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    messageCount: row.message_count
  }));
}

async function listMessagesForChat(chatId, userId) {
  const chat = await getChatForUser(chatId, userId);
  if (!chat) {
    const error = new Error('Chat not found.');
    error.statusCode = 404;
    throw error;
  }

  const messagesResult = await query(
    `
      SELECT id, role, content, created_at
      FROM messages
      WHERE chat_id = $1
      ORDER BY created_at ASC
    `,
    [chatId]
  );

  return {
    id: chat.id,
    title: chat.title,
    createdAt: chat.created_at,
    updatedAt: chat.updated_at,
    messages: messagesResult.rows.map((row) => ({
      id: row.id,
      role: row.role,
      content: row.content,
      createdAt: row.created_at
    }))
  };
}

async function deleteChat(chatId, userId) {
  const result = await query(
    `
      DELETE FROM chats
      WHERE id = $1 AND user_id = $2
      RETURNING id, title
    `,
    [chatId, userId]
  );

  if (!result.rows[0]) {
    const error = new Error('Chat not found.');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: result.rows[0].id,
    title: result.rows[0].title
  };
}

module.exports = {
  authenticateUser,
  appendMessage,
  createPasswordResetToken,
  createChat,
  createSession,
  createUser,
  deleteChat,
  destroySession,
  getUserBySessionToken,
  listChatsForUser,
  listMessagesForChat,
  resetPasswordWithToken,
  updateChatTitle
};
