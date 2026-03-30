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

app.get(['/', '/index.html'], (req, res) => {
  return res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
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

    return res.json({
      ok: true,
      prediction: result.prediction,
      confidence: result.confidence,
      riskScore: result.riskScore,
      grade: result.grade,
      riskLevel: result.riskLevel,
      riskClass: result.riskClass,
      summary: result.summary,
      recommendation: result.recommendation,
      indicators: result.indicators,
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
    const { message } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing message in request' });
    }

    const systemPrompt = [
      'You are Phinny, a friendly and helpful cybersecurity assistant specialized ONLY in phishing detection.',
      '',
      'Your personality:',
      '- Be friendly, calm, and easy to understand.',
      '- Sound like a helpful tech-savvy friend, not a robotic system.',
      '- Be supportive, not scary or overly technical.',
      '- Keep explanations simple but insightful.',
      '',
      'You analyze URLs, messages, and websites. Always consider prior messages in the same session for context.',
      '',
      'When possible, RESPOND FIRST with a single valid JSON object (no surrounding text)',
      'matching this schema exactly:',
      '',
      '{',
      '  "verdict": "SAFE" | "SUSPICIOUS" | "PHISHING" | "INPUT NEEDED" | "GUIDANCE",',
      '  "reasons": ["reason 1", "reason 2", ...],',
      '  "advice": ["advice item 1", "advice item 2", ...],',
      '  "summary": "A short one-line summary",',
      '  "human_readable": "A concise but friendly user-facing reply"',
      '}',
      '',
      'After the JSON object, you may optionally include a human-friendly explanation in Markdown.',
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
      '- If the user greets (e.g., "hello", "hi"), respond warmly with `verdict: "GUIDANCE"`.',
      '- For `GUIDANCE`, keep it short, friendly, and helpful.',
      '- If input cannot be analyzed, use `INPUT NEEDED` with a polite tone.',
      '- For `SUSPICIOUS` or `PHISHING`, clearly explain WHY in simple terms.',
      '- Always give practical, easy-to-follow advice.',
      '- Avoid being overly technical unless necessary.',
      '',
      'Never include text before the JSON. Always include a clear verdict.',
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

    return res.json({ ok: true, reply: replyText, structured });
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
