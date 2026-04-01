const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');
require('dotenv').config();

let pRetry = require('p-retry');
if (pRetry && typeof pRetry !== 'function' && pRetry.default) {
  pRetry = pRetry.default;
}

const { normalizeAndValidateUrl } = require('./utils/urlValidation');
const { scanUrl } = require('./services/scanService');
const {
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
} = require('./services/appDataStore');

const app = express();
const PORT = process.env.PORT || 3000;
const projectRoot = path.join(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const assetsDir = path.join(publicDir, 'assets');
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const allowedOrigins = new Set(
  [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://phishnetai.netlify.app',
    process.env.FRONTEND_ORIGIN
  ].filter(Boolean)
);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  }
}));

app.use(express.static(projectRoot));
app.use('/assets', express.static(assetsDir));
app.use('/public', express.static(publicDir));

function sendStaticFile(res, filePath, missingMessage) {
  if (!fs.existsSync(filePath)) {
    return res.status(404).send(missingMessage);
  }

  return res.sendFile(filePath);
}

function getSessionToken(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  const headerToken = req.headers['x-session-token'];
  return typeof headerToken === 'string' ? headerToken.trim() : '';
}

async function getAuthenticatedUser(req) {
  const token = getSessionToken(req);
  if (!token) return null;
  return await getUserBySessionToken(token);
}

async function requireAuthenticatedUser(req, res) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ ok: false, error: 'You must sign in first.' });
    return null;
  }
  return user;
}

function extractFirstUrlFromText(text) {
  const value = String(text || '').trim();
  if (!value) return null;

  const match = value.match(/https?:\/\/[^\s<>"')\]]+/i);
  return match ? match[0] : null;
}

function buildAssistantScanReply(scanResult, scannedUrl, aiExplanation = null) {
  const statusLabel = scanResult.prediction === 'Phishing'
    ? 'High Risk'
    : (scanResult.riskLevel || 'Low Risk');

  const summary = aiExplanation?.summary || scanResult.summary;
  const pageOverview = aiExplanation?.pageOverview || scanResult.pageOverview;
  const recommendation = aiExplanation?.recommendation || scanResult.recommendation;
  const sourceIndicators = aiExplanation?.indicators?.length ? aiExplanation.indicators : scanResult.indicators;
  const topIndicators = Array.isArray(sourceIndicators)
    ? sourceIndicators.slice(0, 4)
    : [];

  const indicatorBlock = topIndicators.length
    ? topIndicators.map((item) => `- ${item}`).join('\n')
    : '- No strong scanner indicators were returned.';

  return [
    `I scanned **${scannedUrl}** for you.`,
    '',
    `**Result:** ${statusLabel}`,
    `**Grade:** ${scanResult.grade}`,
    `**Risk score:** ${scanResult.riskScore}%`,
    '',
    `**Quick summary:** ${summary}`,
    '',
    `**Website snapshot:** ${pageOverview}`,
    '',
    '**Top indicators:**',
    indicatorBlock,
    '',
    `**What you should do:** ${recommendation}`,
    '',
    '_This assistant scan is helpful, but it is not 100% accurate. Always verify important links before entering sensitive information._'
  ].join('\n');
}

function buildAssistantScanErrorReply(scannedUrl, error) {
  const message = String(error?.message || 'The URL could not be scanned right now.');
  const lowered = message.toLowerCase();
  const isForbidden = message.includes('status 403') || lowered.includes('forbidden');
  const isTimeout = lowered.includes('too long to respond');

  if (isForbidden) {
    return [
      `I tried to scan **${scannedUrl}**, but the website blocked the request with **403 Forbidden**.`,
      '',
      'That usually means the site does not allow automated scanning or external bot access.',
      '',
      '**What you can do:**',
      '- Review the domain manually before trusting it.',
      '- Avoid entering passwords or personal information unless you fully trust the site.',
      '- Try the official site directly or verify the link through another trusted source.',
      '',
      '_This does not automatically mean the site is phishing. It means the scan could not fully access the page._'
    ].join('\n');
  }

  if (isTimeout) {
    return [
      `I tried to scan **${scannedUrl}**, but the website took too long to respond.`,
      '',
      'The page may be slow, temporarily unavailable, or blocking the scan request.',
      '',
      '**What you can do:**',
      '- Try scanning it again in a moment.',
      '- Check if the link opens normally in your browser.',
      '- Be careful before entering any sensitive information.'
    ].join('\n');
  }

  return [
    `I tried to scan **${scannedUrl}**, but the request could not be completed.`,
    '',
    `**Scan note:** ${message}`,
    '',
    '**What you can do:**',
    '- Check if the URL is complete and correct.',
    '- Try scanning it again after a moment.',
    '- If it keeps failing, review the site manually before trusting it.'
  ].join('\n');
}

async function buildAiScanExplanation(scanResult) {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }

  const features = scanResult.features || {};
  const indicatorList = Array.isArray(scanResult.indicators)
    ? scanResult.indicators.slice(0, 8).map((item) => `- ${item}`).join('\n')
    : '- No indicators available.';

  const prompt = [
    'You are helping explain the result of a phishing scanner.',
    'Write plain, natural, student-friendly Markdown.',
    'Be calm, concise, and practical.',
    'Do not change the scanner verdict, grade, or risk score.',
    'Do not exaggerate certainty.',
    'Return JSON only with these exact keys: summary, pageOverview, recommendation, indicators.',
    '',
    `URL: ${scanResult.url}`,
    `Prediction: ${scanResult.prediction}`,
    `Risk level: ${scanResult.riskLevel}`,
    `Risk score: ${scanResult.riskScore}%`,
    `Grade: ${scanResult.grade}`,
    `Known legitimate domain: ${features.knownLegitimateDomain ? 'yes' : 'no'}`,
    `Uses HTTPS: ${features.usesHttps ? 'yes' : 'no'}`,
    `Has password field: ${features.hasPasswordField ? 'yes' : 'no'}`,
    `Has external form action: ${features.hasExternalFormAction ? 'yes' : 'no'}`,
    `Redirected: ${features.redirected ? 'yes' : 'no'}`,
    `Domain age: ${features.domainAge || 'Unavailable'}`,
    '',
    'Indicators:',
    indicatorList,
    '',
    'Writing goals:',
    '- summary: 1 to 2 sentences explaining what the overall result means.',
    '- pageOverview: 1 to 2 sentences describing what the scanned page appears to be based on the scan.',
    '- recommendation: 1 to 2 sentences telling the user what to do next.',
    '- indicators: return 4 to 6 short bullet-style strings that simplify the strongest scanner findings for regular users.',
    '- Keep each field short and readable.'
  ].join('\n');

  try {
    const result = await pRetry(() => {
      return groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You generate short explanation text for phishing scan results. Output valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3
      });
    }, { retries: 1 });

    const rawText = result?.choices?.[0]?.message?.content?.trim();
    if (!rawText) {
      return null;
    }

    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      summary: typeof parsed.summary === 'string' ? parsed.summary.trim() : '',
      pageOverview: typeof parsed.pageOverview === 'string' ? parsed.pageOverview.trim() : '',
      recommendation: typeof parsed.recommendation === 'string' ? parsed.recommendation.trim() : '',
      indicators: Array.isArray(parsed.indicators)
        ? parsed.indicators
            .filter((item) => typeof item === 'string')
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 6)
        : []
    };
  } catch (error) {
    console.warn('AI scan explanation fallback:', error.message || error);
    return null;
  }
}

async function buildChatTitleFromConversation(userMessage, assistantReply) {
  const userText = String(userMessage || '').trim();
  const assistantText = String(assistantReply || '').trim();

  if (!userText && !assistantText) {
    return 'New Chat';
  }

  if (!process.env.GROQ_API_KEY) {
    return userText.length > 48 ? `${userText.slice(0, 48).trim()}...` : (userText || 'New Chat');
  }

  const prompt = [
    'Create a very short chat title for this conversation.',
    'Return plain text only.',
    'No quotation marks.',
    'No markdown.',
    'No period at the end.',
    'Keep it under 7 words.',
    'Make it descriptive and natural like a chatbot history title.',
    '',
    `User message: ${userText}`,
    `Assistant reply: ${assistantText}`
  ].join('\n');

  try {
    const result = await pRetry(() => {
      return groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You generate short chat history titles. Output plain text only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2
      });
    }, { retries: 1 });

    const title = String(result?.choices?.[0]?.message?.content || '')
      .replace(/["`#*_]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!title) {
      return userText.length > 48 ? `${userText.slice(0, 48).trim()}...` : (userText || 'New Chat');
    }

    return title;
  } catch (error) {
    console.warn('Chat title generation fallback:', error.message || error);
    return userText.length > 48 ? `${userText.slice(0, 48).trim()}...` : (userText || 'New Chat');
  }
}

async function maybeUpdateChatTitle(user, chatId, userMessage, assistantReply) {
  if (!user || !chatId) return null;

  try {
    const chat = await listMessagesForChat(chatId, user.id);
    const currentTitle = String(chat.title || '').trim();
    const shouldUpdate = currentTitle === 'New Chat' || chat.messages.length <= 2;

    if (!shouldUpdate) {
      return currentTitle;
    }

    const nextTitle = await buildChatTitleFromConversation(userMessage, assistantReply);
    const updated = await updateChatTitle(chatId, user.id, nextTitle);
    return updated.title;
  } catch (error) {
    console.warn('Chat title update skipped:', error.message || error);
    return null;
  }
}

function validateAuthPayload({ name, email, password, requireName = false }) {
  const trimmedName = String(name || '').trim();
  const trimmedEmail = String(email || '').trim().toLowerCase();
  const rawPassword = String(password || '');

  if (requireName && trimmedName.length < 2) {
    const error = new Error('Please enter your full name.');
    error.statusCode = 400;
    throw error;
  }

  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    const error = new Error('Please enter a valid email address.');
    error.statusCode = 400;
    throw error;
  }

  if (rawPassword.length < 6) {
    const error = new Error('Password must be at least 6 characters long.');
    error.statusCode = 400;
    throw error;
  }

  return {
    name: trimmedName,
    email: trimmedEmail,
    password: rawPassword
  };
}

app.get('/style.css', (req, res) => {
  const filePath = path.join(assetsDir, 'css', 'style.css');
  res.type('text/css');
  return sendStaticFile(res, filePath, 'style.css not found');
});

app.get('/logo.png', (req, res) => {
  const filePath = path.join(assetsDir, 'images', 'logo.png');
  res.type('image/png');
  return sendStaticFile(res, filePath, 'logo.png not found');
});

app.get('/assistant.html', (req, res) => {
  const filePath = path.join(publicDir, 'assistant.html');
  return sendStaticFile(res, filePath, 'assistant.html not found');
});

app.get('/login.html', (req, res) => {
  const filePath = path.join(publicDir, 'login.html');
  return sendStaticFile(res, filePath, 'login.html not found');
});

app.get('/signup.html', (req, res) => {
  const filePath = path.join(publicDir, 'signup.html');
  return sendStaticFile(res, filePath, 'signup.html not found');
});

app.get('/reset-password.html', (req, res) => {
  const filePath = path.join(publicDir, 'reset-password.html');
  return sendStaticFile(res, filePath, 'reset-password.html not found');
});

app.get('/quiz.html', (req, res) => {
  const filePath = path.join(publicDir, 'quiz.html');
  return sendStaticFile(res, filePath, 'quiz.html not found');
});

app.get(['/', '/index.html'], (req, res) => {
  return res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = validateAuthPayload({
      ...req.body,
      requireName: true
    });

    const user = await createUser({ name, email, password });
    const token = await createSession(user.id);

    return res.status(201).json({
      ok: true,
      token,
      user
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      error: error.message || 'Could not create account right now.'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = validateAuthPayload(req.body || {});
    const user = await authenticateUser({ email, password });
    const token = await createSession(user.id);

    return res.json({
      ok: true,
      token,
      user
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      error: error.message || 'Could not sign in right now.'
    });
  }
});

app.get('/api/auth/me', async (req, res) => {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'No active session.' });
  }

  return res.json({ ok: true, user });
});

app.post('/api/auth/logout', async (req, res) => {
  const token = getSessionToken(req);
  if (token) {
    await destroySession(token);
  }

  return res.json({ ok: true });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        ok: false,
        error: 'Please enter a valid email address.'
      });
    }

    const resetEntry = await createPasswordResetToken(email);
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    return res.json({
      ok: true,
      message: 'If an account with that email exists, a password reset link has been prepared.',
      resetUrl: resetEntry ? `${baseUrl}/reset-password.html?token=${resetEntry.token}` : null
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      error: error.message || 'Could not start password reset right now.'
    });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const token = String(req.body?.token || '').trim();
    const password = String(req.body?.password || '');

    if (!token) {
      return res.status(400).json({
        ok: false,
        error: 'Missing reset token.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    await resetPasswordWithToken(token, password);

    return res.json({
      ok: true,
      message: 'Your password has been updated. You can sign in now.'
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      error: error.message || 'Could not reset password right now.'
    });
  }
});

app.get('/api/chats', async (req, res) => {
  const user = await requireAuthenticatedUser(req, res);
  if (!user) return;

  return res.json({
    ok: true,
    chats: await listChatsForUser(user.id)
  });
});

app.post('/api/chats', async (req, res) => {
  const user = await requireAuthenticatedUser(req, res);
  if (!user) return;

  const titleSeed = typeof req.body?.title === 'string' ? req.body.title : '';
  const chat = await createChat(user.id, titleSeed);

  return res.status(201).json({
    ok: true,
    chat
  });
});

app.get('/api/chats/:chatId/messages', async (req, res) => {
  const user = await requireAuthenticatedUser(req, res);
  if (!user) return;

  try {
    const chat = await listMessagesForChat(req.params.chatId, user.id);
    return res.json({
      ok: true,
      chat
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      error: error.message || 'Could not load chat messages.'
    });
  }
});

app.delete('/api/chats/:chatId', async (req, res) => {
  const user = await requireAuthenticatedUser(req, res);
  if (!user) return;

  try {
    const deleted = await deleteChat(req.params.chatId, user.id);
    return res.json({
      ok: true,
      deleted
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      error: error.message || 'Could not delete chat.'
    });
  }
});

// This route handles the phishing scan flow:
// frontend -> Node.js -> Python AI service -> frontend response.
app.post('/api/scan', async (req, res) => {
  try {
    const { url } = req.body || {};
    const validation = normalizeAndValidateUrl(url);

    if (!validation.ok) {
      return res.status(400).json({
        ok: false,
        error: validation.error
      });
    }

    const result = await scanUrl(validation.url);
    const aiExplanation = await buildAiScanExplanation(result);

    return res.json({
      ok: true,
      prediction: result.prediction,
      confidence: result.confidence,
      riskScore: result.riskScore,
      grade: result.grade,
      riskLevel: result.riskLevel,
      riskClass: result.riskClass,
      summary: aiExplanation?.summary || result.summary,
      pageOverview: aiExplanation?.pageOverview || result.pageOverview,
      recommendation: aiExplanation?.recommendation || result.recommendation,
      indicators: aiExplanation?.indicators?.length ? aiExplanation.indicators : result.indicators,
      features: result.features,
      url: result.url
    });
  } catch (error) {
    console.error('SCAN ERROR:', error.message || error);

    return res.status(error.statusCode || 500).json({
      ok: false,
      error: error.message || 'The URL could not be analyzed right now.'
    });
  }
});

app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message, history, chatId } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing message in request' });
    }

    const authenticatedUser = await getAuthenticatedUser(req);
    let activeChatId = authenticatedUser ? String(chatId || '').trim() : '';
    let persistedHistory = [];

    if (authenticatedUser && activeChatId) {
      const existingChat = await listMessagesForChat(activeChatId, authenticatedUser.id);
      persistedHistory = existingChat.messages
        .slice(-12)
        .map((entry) => ({
          role: entry.role === 'assistant' ? 'assistant' : 'user',
          content: entry.content
        }));
    }

    const detectedUrl = extractFirstUrlFromText(message);
    if (detectedUrl) {
      const validation = normalizeAndValidateUrl(detectedUrl);

      if (!validation.ok) {
        return res.status(400).json({ ok: false, error: validation.error });
      }

      try {
        if (authenticatedUser && !activeChatId) {
          activeChatId = (await createChat(authenticatedUser.id, message)).id;
        }

        const scanResult = await scanUrl(validation.url);
        const aiExplanation = await buildAiScanExplanation(scanResult);
        const reply = buildAssistantScanReply(
          scanResult,
          scanResult.url || validation.url,
          aiExplanation
        );

        if (authenticatedUser && activeChatId) {
          await appendMessage(activeChatId, authenticatedUser.id, 'user', message);
          await appendMessage(activeChatId, authenticatedUser.id, 'assistant', reply);
          await maybeUpdateChatTitle(authenticatedUser, activeChatId, message, reply);
        }

        return res.json({
          ok: true,
          reply,
          chatId: activeChatId || null,
          scanResult: {
            prediction: scanResult.prediction,
            riskScore: scanResult.riskScore,
            grade: scanResult.grade,
            riskLevel: scanResult.riskLevel,
            url: scanResult.url
          }
        });
      } catch (scanError) {
        const reply = buildAssistantScanErrorReply(validation.url, scanError);

        if (authenticatedUser) {
          if (!activeChatId) {
            activeChatId = (await createChat(authenticatedUser.id, message)).id;
          }

          await appendMessage(activeChatId, authenticatedUser.id, 'user', message);
          await appendMessage(activeChatId, authenticatedUser.id, 'assistant', reply);
          await maybeUpdateChatTitle(authenticatedUser, activeChatId, message, reply);
        }

        return res.json({
          ok: true,
          reply,
          chatId: activeChatId || null
        });
      }
    }

    const normalizedHistory = authenticatedUser && activeChatId
      ? persistedHistory
      : Array.isArray(history)
      ? history
          .filter((entry) => entry && typeof entry.content === 'string')
          .map((entry) => ({
            role: entry.role === 'assistant' ? 'assistant' : 'user',
            content: entry.content.trim()
          }))
          .filter((entry) => entry.content.length > 0)
          .slice(-12)
      : [];

    const systemPrompt = [
      'You are Phinny, a friendly and helpful AI assistant for PhishNet AI.',
      '',
      'Your personality:',
      '- Be friendly, calm, and easy to understand.',
      '- Sound like a helpful tech-savvy friend, not a robotic system.',
      '- Be supportive, not scary or overly technical.',
      '- Keep explanations simple but insightful.',
      '',
      'Primary expertise: phishing detection, suspicious links, online scams, account safety, and related cybersecurity awareness.',
      'You can still answer general questions, greetings, or casual messages, but keep those replies short and natural.',
      'Give more detailed explanations only when the topic is phishing, suspicious URLs, scam messages, account safety, or closely related cybersecurity topics.',
      'If the topic is unrelated to phishing or cybersecurity, answer briefly and do not become overly detailed.',
      'You analyze URLs, messages, and websites when the user asks for help checking something suspicious.',
      'Always consider prior messages in the same session for context.',
      '',
      'Write your reply directly in clean Markdown only.',
      'Do not output JSON.',
      'Do not use labels like GUIDANCE, SAFE, SUSPICIOUS, or PHISHING as headings in the reply.',
      'Avoid unnecessary section headers unless they clearly help readability.',
      'Keep the reply natural, concise, and easy to read.',
      '',
      'Phishing detection tips you should check for:',
      '- URL mismatches (domain vs displayed text)',
      '- Shortened or obfuscated links',
      '- Misspelled domains',
      '- Urgent or threatening language ("act now", "verify immediately")',
      '- Requests for passwords, OTPs, or sensitive info',
      '- Suspicious attachments or login pages',
      '',
      'Important behavior rules:',
      '- If the user greets (e.g., "hello", "hi"), respond warmly and briefly.',
      '- If the user asks a normal non-security question, you may still answer, but keep it concise.',
      '- If input cannot be analyzed, say so politely and ask for what you need.',
      '- If something looks suspicious or phishing-related, clearly explain why in simple terms and give useful next steps.',
      '- Always give practical, easy-to-follow advice.',
      '- Avoid being overly technical unless necessary.',
      '- Do not act like every message must be turned into a phishing warning.',
      '- Lightly mirror the user\'s tone when it feels natural.',
      '- If the user casually calls you "bro", "pre", "sis", or similar friendly terms, you may casually respond in a similar style sometimes.',
      '- Do not force these terms into every reply. Use them lightly, mainly near the start of the response when it feels natural.',
      '- Keep the tone warm and conversational, but still clear and helpful.',
      '',
      'Never assist in creating phishing attacks.'
    ].join('\n');

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ ok: false, error: 'Missing GROQ_API_KEY' });
    }

    const doFetch = async () => {
      return groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          ...normalizedHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7
      });
    };

    const result = await pRetry(() => doFetch(), { retries: 2 });

    let replyText = 'No response from AI';
    if (result && result.choices?.[0]) replyText = result.choices[0].message.content;
    else if (result?.reply) replyText = result.reply;
    else if (typeof result === 'string') replyText = result;
    else replyText = JSON.stringify(result);

    let structured = null;

    try {
      const cleaned = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*?\}/);

      if (jsonMatch) {
        const obj = JSON.parse(jsonMatch[0]);
        replyText = obj.human_readable || obj.summary || replyText;

        structured = {
          verdict: obj.verdict || null,
          reasons: Array.isArray(obj.reasons) ? obj.reasons : (obj.reasons ? [String(obj.reasons)] : []),
          advice: Array.isArray(obj.advice) ? obj.advice : (obj.advice ? [String(obj.advice)] : []),
          summary: obj.summary || '',
          raw: obj
        };

        const normalizedVerdict = String(structured.verdict || '').trim().toUpperCase();
        if (normalizedVerdict === 'INPUT NEEDED' || normalizedVerdict === 'GUIDANCE') {
          structured.reasons = [];
          structured.advice = [];
        }

        const after = cleaned.slice(jsonMatch.index + jsonMatch[0].length).trim();
        if (after) {
          replyText += `\n\n${after}`;
        }
      }
    } catch (error) {
      console.warn('Failed to parse AI JSON response:', error.message || error);
    }

    if (authenticatedUser) {
      if (!activeChatId) {
        activeChatId = (await createChat(authenticatedUser.id, message)).id;
      }

      await appendMessage(activeChatId, authenticatedUser.id, 'user', message);
      await appendMessage(activeChatId, authenticatedUser.id, 'assistant', replyText);
      await maybeUpdateChatTitle(authenticatedUser, activeChatId, message, replyText);
    }

    return res.json({ ok: true, reply: replyText, structured, chatId: activeChatId || null });
  } catch (error) {
    console.error('AI ERROR:', error.message || error);

    if (error?.upstream?.error?.code) {
      const code = error.upstream.error.code;

      switch (code) {
        case 'invalid_request_error':
          return res.status(400).json({ ok: false, error: error.upstream.error.message || 'Invalid request to AI' });
        case 'authentication_error':
          return res.status(401).json({ ok: false, error: 'Invalid or missing API key' });
        case 'permission_error':
          return res.status(403).json({ ok: false, error: 'You do not have permission to use this model' });
        case 'rate_limit_error':
          return res.status(429).json({ ok: false, error: 'Rate limit exceeded', retryAfter: 10 });
        case 'server_error':
          return res.status(502).json({ ok: false, error: 'AI server error, please try again later' });
        default:
          return res.status(500).json({ ok: false, error: error.upstream.error.message || 'Unknown AI error' });
      }
    }

    return res.status(500).json({ ok: false, error: error.message || 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`PhishNet AI backend running at http://localhost:${PORT}`);
});
