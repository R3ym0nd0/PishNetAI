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
    profileNote: row.profile_note || '',
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

const QUIZ_POINT_VALUES = {
  'url-basics': 80,
  'login-page-clues': 100,
  'message-red-flags': 110,
  'after-clicking': 90,
  'qr-link-safety': 110,
  'social-media-scams': 120,
  'sender-source-checks': 130,
  'attachment-download-safety': 130,
  'account-recovery-traps': 140,
  'form-data-requests': 140,
  'payment-delivery-scams': 150,
  'support-impersonation': 150,
  'scholarship-bait': 160,
  'document-sharing-traps': 160,
  'mobile-alert-deception': 170,
  'event-registration-risks': 170,
  'marketplace-meetup-scams': 180,
  'multi-step-phish-cases': 190,
  'campus-portal-spoofs': 200,
  'urgent-admin-fraud': 210,
  'cloud-drive-compromise': 220,
  'internship-hiring-scams': 220,
  'verification-chain-attacks': 230,
  'phishing-scenarios': 240,
  'executive-impersonation': 250,
  'breach-followup-scams': 260,
  'recovery-flow-attacks': 270,
  'financial-approval-fraud': 280,
  'cross-channel-takeovers': 290,
  'best-practices': 320,
  'vendor-portal-breaches': 340,
  'identity-chain-spoofs': 350,
  'cloud-consent-traps': 360,
  'incident-response-bait': 370,
  'multi-actor-escalations': 380,
  'trust-layer-collisions': 390,
  'zero-trust-breakpoints': 410,
  'live-session-hijacks': 420,
  'delegated-access-fraud': 430,
  'forensic-cover-stories': 440,
  'approval-chain-poisoning': 450,
  'adaptive-impersonation-loops': 460,
  'supply-chain-shadowing': 480,
  'federated-login-pivots': 490,
  'trust-graph-manipulation': 500,
  'incident-command-spoofs': 510,
  'recovery-delegation-loops': 520,
  'environment-poisoning-cases': 530,
  'cross-tenant-bleedthrough': 550,
  'response-playbook-subversion': 560,
  'consent-laundering-rings': 570,
  'governance-theater-attacks': 580,
  'identity-weathering-loops': 590,
  'signal-fog-exploitation': 600,
  'trust-collapse-scenarios': 620,
  'operator-blend-intrusions': 630,
  'decision-fatigue-breaches': 640,
  'control-plane-misdirection': 650,
  'cognitive-overlap-attacks': 660,
  'irrecoverable-trust-failures': 670,
  'lab-login-page-check': 100,
  'lab-email-header-clues': 110,
  'lab-qr-poster-check': 120,
  'lab-file-share-trap': 130,
  'lab-password-reset-sms': 140,
  'lab-delivery-scam-chat': 150
};

function getCompletedQuizIdsFromAttempts(attempts = []) {
  const completedQuizIds = new Set();

  attempts.forEach((attempt) => {
    const quizId = String(attempt?.quizId || '').trim();
    const percentage = Number(attempt?.percentage || 0);

    if (quizId && percentage >= 75) {
      completedQuizIds.add(quizId);
    }
  });

  return completedQuizIds;
}

function getEarnedPointsFromCompletedQuizIds(completedQuizIds = new Set()) {
  return [...completedQuizIds].reduce((total, quizId) => total + Number(QUIZ_POINT_VALUES[quizId] || 0), 0);
}

function getStrongQuizCountFromAttempts(attempts = [], minimumScore = 85) {
  const bestByQuizId = new Map();

  attempts.forEach((attempt) => {
    const quizId = String(attempt?.quizId || '').trim();
    const percentage = Number(attempt?.percentage || 0);
    if (!quizId) return;
    bestByQuizId.set(quizId, Math.max(bestByQuizId.get(quizId) || 0, percentage));
  });

  return [...bestByQuizId.values()].filter((score) => score >= minimumScore).length;
}

async function createUser({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const passwordData = buildPasswordData(password);

  try {
    const result = await query(
      `
        INSERT INTO users (name, email, password_hash, password_salt)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, profile_note, created_at
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
      SELECT id, name, email, profile_note, password_hash, password_salt, created_at
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
        SELECT id, name, email, profile_note, created_at
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

async function updateUserProfileNote(userId, profileNote) {
  const trimmedNote = String(profileNote || '').trim().slice(0, 120);

  const result = await query(
    `
      UPDATE users
      SET profile_note = $2
      WHERE id = $1
      RETURNING id, name, email, profile_note, created_at
    `,
    [userId, trimmedNote]
  );

  if (!result.rows[0]) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(result.rows[0]);
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

async function createQuizAttempt(userId, { quizId, quizTitle, score, totalQuestions, percentage, reviewData = [] }) {
  const result = await query(
    `
      INSERT INTO quiz_attempts (user_id, quiz_id, quiz_title, score, total_questions, percentage, review_data)
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
      RETURNING id, user_id, quiz_id, quiz_title, score, total_questions, percentage, review_data, created_at
    `,
    [
      userId,
      String(quizId || '').trim(),
      String(quizTitle || '').trim(),
      Number(score || 0),
      Number(totalQuestions || 0),
      Number(percentage || 0),
      JSON.stringify(Array.isArray(reviewData) ? reviewData : [])
    ]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    userId: row.user_id,
    quizId: row.quiz_id,
    quizTitle: row.quiz_title,
      score: Number(row.score),
      totalQuestions: Number(row.total_questions),
      percentage: Number(row.percentage),
      reviewData: Array.isArray(row.review_data) ? row.review_data : [],
      createdAt: row.created_at
    };
  }

async function listQuizAttemptsForUser(userId, limit = 100) {
  const result = await query(
    `
      SELECT id, user_id, quiz_id, quiz_title, score, total_questions, percentage, created_at
      FROM quiz_attempts
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `,
    [userId, Math.max(1, Math.min(Number(limit) || 100, 200))]
  );

  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    quizId: row.quiz_id,
    quizTitle: row.quiz_title,
    score: Number(row.score),
    totalQuestions: Number(row.total_questions),
    percentage: Number(row.percentage),
    createdAt: row.created_at
  }));
}

async function getQuizAttemptById(userId, attemptId) {
  const result = await query(
    `
      SELECT id, user_id, quiz_id, quiz_title, score, total_questions, percentage, review_data, created_at
      FROM quiz_attempts
      WHERE user_id = $1 AND id = $2
      LIMIT 1
    `,
    [userId, attemptId]
  );

  const row = result.rows[0];
  if (!row) {
    const error = new Error('Quiz attempt not found.');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: row.id,
    userId: row.user_id,
    quizId: row.quiz_id,
    quizTitle: row.quiz_title,
    score: Number(row.score),
    totalQuestions: Number(row.total_questions),
    percentage: Number(row.percentage),
    reviewData: Array.isArray(row.review_data) ? row.review_data : [],
    createdAt: row.created_at
  };
}

async function buildQuizLeaderboardEntries() {
  const result = await query(
    `
      SELECT
        qa.user_id,
        u.name,
        qa.quiz_id,
        qa.percentage,
        qa.created_at
      FROM quiz_attempts qa
      INNER JOIN users u ON u.id = qa.user_id
      ORDER BY qa.created_at DESC
    `
  );

  const grouped = new Map();

  result.rows.forEach((row) => {
    const entry = grouped.get(row.user_id) || {
      userId: row.user_id,
      name: row.name,
      attempts: []
    };

    entry.attempts.push({
      quizId: row.quiz_id,
      percentage: Number(row.percentage || 0),
      createdAt: row.created_at
    });

    grouped.set(row.user_id, entry);
  });

  return [...grouped.values()]
    .filter((entry) => entry.attempts.length >= 2)
    .map((entry) => {
      const attemptsCount = entry.attempts.length;
      const averageScore = attemptsCount
        ? Number((entry.attempts.reduce((total, attempt) => total + attempt.percentage, 0) / attemptsCount).toFixed(1))
        : 0;
      const bestScore = entry.attempts.reduce((best, attempt) => Math.max(best, attempt.percentage), 0);
      const completedQuizIds = getCompletedQuizIdsFromAttempts(entry.attempts);
      const completedSetsCount = completedQuizIds.size;
      const earnedPoints = getEarnedPointsFromCompletedQuizIds(completedQuizIds);
      const lastAttemptAt = entry.attempts.reduce((latest, attempt) => (
        String(latest) > String(attempt.createdAt) ? latest : attempt.createdAt
      ), '');

      return {
        userId: entry.userId,
        name: entry.name,
        attemptsCount,
        averageScore,
        bestScore,
        completedSetsCount,
        earnedPoints,
        lastAttemptAt
      };
    })
    .sort((left, right) => {
      if (left.earnedPoints !== right.earnedPoints) return right.earnedPoints - left.earnedPoints;
      if (left.averageScore !== right.averageScore) return right.averageScore - left.averageScore;
      if (left.bestScore !== right.bestScore) return right.bestScore - left.bestScore;
      return String(right.lastAttemptAt).localeCompare(String(left.lastAttemptAt));
    })
    .map((entry, index) => ({
      rank: index + 1,
      ...entry
    }));
}

async function getQuizLeaderboard(limit = 10) {
  return (await buildQuizLeaderboardEntries())
    .slice(0, Math.max(1, Math.min(Number(limit) || 10, 25)))
}

async function getQuizLeaderboardRankForUser(userId) {
  if (!userId) return null;

  const entries = await buildQuizLeaderboardEntries();
  const match = entries.find((entry) => entry.userId === userId);
  return match ? match.rank : null;
}

async function getPublicQuizProfile(userId) {
  const summaryResult = await query(
    `
      SELECT
        u.id,
        u.name,
        u.profile_note,
        COUNT(qa.id)::int AS attempts_count,
        ROUND(AVG(qa.percentage)::numeric, 1) AS average_score,
        MAX(qa.percentage)::numeric AS best_score,
        MAX(qa.created_at) AS last_attempt_at
      FROM users u
      LEFT JOIN quiz_attempts qa ON qa.user_id = u.id
      WHERE u.id = $1
      GROUP BY u.id, u.name
    `,
    [userId]
  );

  const summary = summaryResult.rows[0];
  if (!summary) {
    const error = new Error('Profile not found.');
    error.statusCode = 404;
    throw error;
  }

  const progressResult = await query(
    `
      SELECT
        quiz_id,
        quiz_title,
        COUNT(id)::int AS attempts_count,
        ROUND(AVG(percentage)::numeric, 1) AS average_score,
        MAX(percentage)::numeric AS best_score
      FROM quiz_attempts
      WHERE user_id = $1
      GROUP BY quiz_id, quiz_title
      ORDER BY average_score DESC, best_score DESC, quiz_title ASC
    `,
    [userId]
  );

  const topics = progressResult.rows.map((row) => ({
    quizId: row.quiz_id,
    quizTitle: row.quiz_title,
    attemptsCount: Number(row.attempts_count),
    averageScore: Number(row.average_score),
    bestScore: Number(row.best_score)
  }));

  const attemptsResult = await query(
    `
      SELECT quiz_id, percentage, created_at
      FROM quiz_attempts
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId]
  );

  const allAttempts = attemptsResult.rows.map((row) => ({
    quizId: row.quiz_id,
    percentage: Number(row.percentage || 0),
    createdAt: row.created_at
  }));

  const attemptsCount = allAttempts.length;
  const averageScore = attemptsCount
    ? Number((allAttempts.reduce((total, attempt) => total + attempt.percentage, 0) / attemptsCount).toFixed(1))
    : 0;
  const bestScore = allAttempts.reduce((best, attempt) => Math.max(best, attempt.percentage), 0);
  const completedQuizIds = getCompletedQuizIdsFromAttempts(allAttempts);
  const earnedPoints = getEarnedPointsFromCompletedQuizIds(completedQuizIds);
  const allQuizIds = [
    'url-basics',
    'login-page-clues',
    'message-red-flags',
    'after-clicking',
    'qr-link-safety',
    'social-media-scams',
    'sender-source-checks',
    'attachment-download-safety',
    'account-recovery-traps',
    'form-data-requests',
    'payment-delivery-scams',
    'support-impersonation',
    'scholarship-bait',
    'document-sharing-traps',
    'mobile-alert-deception',
    'event-registration-risks',
    'marketplace-meetup-scams',
    'multi-step-phish-cases',
    'campus-portal-spoofs',
    'urgent-admin-fraud',
    'cloud-drive-compromise',
    'internship-hiring-scams',
    'verification-chain-attacks',
    'phishing-scenarios',
    'executive-impersonation',
    'breach-followup-scams',
    'recovery-flow-attacks',
    'financial-approval-fraud',
    'cross-channel-takeovers',
    'best-practices',
    'vendor-portal-breaches',
    'identity-chain-spoofs',
    'cloud-consent-traps',
    'incident-response-bait',
    'multi-actor-escalations',
    'trust-layer-collisions',
    'zero-trust-breakpoints',
    'live-session-hijacks',
    'delegated-access-fraud',
    'forensic-cover-stories',
    'approval-chain-poisoning',
    'adaptive-impersonation-loops',
    'supply-chain-shadowing',
    'federated-login-pivots',
    'trust-graph-manipulation',
    'incident-command-spoofs',
    'recovery-delegation-loops',
    'environment-poisoning-cases',
    'cross-tenant-bleedthrough',
    'response-playbook-subversion',
    'consent-laundering-rings',
    'governance-theater-attacks',
    'identity-weathering-loops',
    'signal-fog-exploitation',
    'trust-collapse-scenarios',
    'operator-blend-intrusions',
    'decision-fatigue-breaches',
    'control-plane-misdirection',
    'cognitive-overlap-attacks',
    'irrecoverable-trust-failures'
  ];
  const coreQuizIds = [
    'url-basics',
    'login-page-clues',
    'message-red-flags',
    'after-clicking',
    'qr-link-safety',
    'social-media-scams'
  ];
  const strongAttemptsCount = getStrongQuizCountFromAttempts(allAttempts, 85);
  const needsReviewCleared = completedQuizIds.size;
  const advancedCompleted = completedQuizIds.has('phishing-scenarios');
  const masteryCompleted = completedQuizIds.has('best-practices');

  const badges = [
    {
      id: 'first-step',
      title: 'First Step',
      earned: completedQuizIds.size >= 1
    },
    {
      id: 'practice-streak',
      title: 'Practice Streak',
      earned: earnedPoints >= 180
    },
    {
      id: 'steady-learner',
      title: 'Steady Learner',
      earned: earnedPoints >= 300
    },
    {
      id: 'sharp-eye',
      title: 'Sharp Eye',
      earned: bestScore >= 90
    },
    {
      id: 'steady-awareness',
      title: 'Steady Awareness',
      earned: averageScore >= 75 && completedQuizIds.size >= 2
    },
    {
      id: 'topic-explorer',
      title: 'Topic Explorer',
      earned: completedQuizIds.size >= 3
    },
    {
      id: 'full-coverage',
      title: 'Full Coverage',
      earned: coreQuizIds.every((quizId) => completedQuizIds.has(quizId))
    },
    {
      id: 'strong-finisher',
      title: 'Strong Finisher',
      earned: strongAttemptsCount >= 3
    },
    {
      id: 'review-crusher',
      title: 'Review Crusher',
      earned: needsReviewCleared >= 30
    },
    {
      id: 'scenario-survivor',
      title: 'Scenario Survivor',
      earned: advancedCompleted
    },
    {
      id: 'mastery-unlocked',
      title: 'Mastery Unlocked',
      earned: masteryCompleted
    },
    {
      id: 'guardian-grade',
      title: 'Guardian Grade',
      earned: averageScore >= 88 && earnedPoints >= 500
    },
    {
      id: 'phishnet-complete',
      title: 'PhishNet Complete',
      earned: allQuizIds.every((quizId) => completedQuizIds.has(quizId))
    }
  ];

  return {
    userId: summary.id,
    name: summary.name,
    profileNote: summary.profile_note || '',
    attemptsCount,
    averageScore,
    bestScore,
    strongResultsCount: strongAttemptsCount,
    earnedPoints,
    lastAttemptAt: summary.last_attempt_at,
    topics,
    badges
  };
}

async function getPublicSiteStats() {
  const result = await query(
    `
      SELECT
        (SELECT COUNT(*)::int FROM users) AS users_count,
        (SELECT COUNT(*)::int FROM quiz_attempts) AS quiz_attempts_count,
        (SELECT COUNT(*)::int FROM chats) AS chats_count
    `
  );

  const row = result.rows[0] || {};

  return {
    usersCount: Number(row.users_count || 0),
    quizAttemptsCount: Number(row.quiz_attempts_count || 0),
    chatsCount: Number(row.chats_count || 0)
  };
}

module.exports = {
  authenticateUser,
  appendMessage,
  createQuizAttempt,
  createPasswordResetToken,
  createChat,
  createSession,
  createUser,
  deleteChat,
  destroySession,
  getPublicSiteStats,
  getQuizAttemptById,
  getPublicQuizProfile,
  getQuizLeaderboard,
  getQuizLeaderboardRankForUser,
  getUserBySessionToken,
  listChatsForUser,
  listMessagesForChat,
  listQuizAttemptsForUser,
  resetPasswordWithToken,
  updateChatTitle,
  updateUserProfileNote
};
