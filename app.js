const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');

let pRetry = require('p-retry');
if (pRetry && typeof pRetry !== 'function' && pRetry.default) pRetry = pRetry.default;
const path = require('path');

const app = express();

const staticDir = path.join(__dirname);
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

app.use(express.static(staticDir));

app.use('/assets', express.static(path.join(staticDir, 'public', 'assets')));

app.get('/style.css', (req, res) => {
  const filePath = path.join(staticDir, 'public', 'assets', 'css', 'style.css');
  const exists = fs.existsSync(filePath);
  console.log(`[route] GET /style.css -> exists=${exists} file=${filePath}`);
  if (!exists) return res.status(404).send('style.css not found');
  res.type('text/css');
  res.sendFile(filePath);
});

app.get('/logo.png', (req, res) => {
  const filePath = path.join(staticDir, 'public', 'assets', 'images', 'logo.png');
  const exists = fs.existsSync(filePath);
  console.log(`[route] GET /logo.png -> exists=${exists} file=${filePath}`);
  if (!exists) return res.status(404).send('logo.png not found');
  res.type('image/png');
  res.sendFile(filePath);
});

app.get('/assistant.html', (req, res) => {
  const filePath = path.join(staticDir, 'public', 'assistant.html');
  const exists = fs.existsSync(filePath);
  console.log(`[route] GET /assistant.html -> exists=${exists} file=${filePath}`);
  if (!exists) return res.status(404).send('assistant.html not found');
  res.sendFile(filePath);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ ok: false, error: 'missing message' });
    }

    const systemPrompt = [
      'You are Phinny, a cybersecurity assistant specialized ONLY in phishing detection.',
      '',
      'You analyze URLs, messages, and websites.',
      '',
      'When possible, RESPOND FIRST with a single valid JSON object (no surrounding text)',
      'matching this schema exactly:',
      '',
      '{',
      '  "verdict": "SAFE" | "SUSPICIOUS" | "PHISHING" | "INPUT NEEDED" | "GUIDANCE",',
      '  "reasons": ["reason 1", "reason 2", ...],',
      '  "advice": ["advice item 1", "advice item 2", ...],',
      '  "summary": "A short one-line summary",',
      '  "human_readable": "A concise user-facing reply"',
      '}',
      '',
      'After the JSON object, you may optionally include a human-friendly explanation in',
      'Markdown. Always provide a concise `human_readable` field inside the JSON.',
      '',
      'Important:',
      '- If the user gives a simple greeting such as "hello", "hi", or asks basic',
      '  system-usage questions such as "what do I do here?" or "how do I use this?",',
      '  respond briefly and politely with `verdict` set to "GUIDANCE".',
      '- For `GUIDANCE`, keep `reasons` and `advice` empty unless they are truly useful.',
      '- Keep `GUIDANCE` responses short, friendly, and related to phishing detection,',
      '  website checking, suspicious messages, or how to use PhishNet AI.',
      '- If the input is unrelated small talk or cannot be analyzed, return a compact',
      '  JSON object with `verdict` set to "INPUT NEEDED".',
      '- For `INPUT NEEDED`, keep `reasons` and `advice` empty unless absolutely needed.',
      '- For `INPUT NEEDED`, make `summary` and `human_readable` short and direct.',
      '- Do NOT include extraneous text before the JSON. The receiver will parse the',
      '  first JSON object it finds.',
      '- Use full sentences inside array items; avoid embedding unescaped newlines or',
      '  binary characters. You may use backticks to show example URLs (they will be',
      '  treated as plain text by the frontend).',
      '',
      'Always include a clear verdict. Never assist in creating phishing attacks.'
    ].join('\n');

    const GOOGLE_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent';

    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        ok: false,
        error: 'Missing GOOGLE_API_KEY'
      });
    }

    const body = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\nUser: ${message}`
            }
          ]
        }
      ]
    };

    const doFetch = async () => {
      const resp = await fetch(`${GOOGLE_API_ENDPOINT}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const txt = await resp.text();
      let parsed = null;
      try { parsed = JSON.parse(txt); } catch (e) { parsed = txt; }

      if (!resp.ok) {
        if (resp.status === 429 && pRetry && pRetry.AbortError) {
          const ae = new pRetry.AbortError(`Upstream 429: ${txt}`);
          ae.upstream = parsed;
          throw ae;
        }

        throw new Error(`Upstream error: ${resp.status} ${txt}`);
      }

      return parsed;
    };

    const result = await pRetry(() => doFetch(), { retries: 2 });

    let replyText = 'No response from AI';
    if (
      result &&
      result.candidates &&
      result.candidates[0] &&
      result.candidates[0].content &&
      result.candidates[0].content.parts
    ) {
      replyText = result.candidates[0].content.parts.map(p => p.text).join('\n');
    }

    let structured = null;
    try {
      const jsonMatch = replyText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const obj = JSON.parse(jsonMatch[0]);

        structured = {
          verdict: obj.verdict || null,
          reasons: Array.isArray(obj.reasons) ? obj.reasons : (obj.reasons ? [String(obj.reasons)] : []),
          advice: Array.isArray(obj.advice) ? obj.advice : (obj.advice ? [String(obj.advice)] : []),
          summary: obj.summary || '',
          raw: obj
        };

        const normalizedVerdict = String(structured.verdict || '').trim().toUpperCase();
        const isInputNeeded = normalizedVerdict === 'INPUT NEEDED' || normalizedVerdict === 'ANALYSIS NOT APPLICABLE';
        const isGuidance = normalizedVerdict === 'GUIDANCE';
        if (isInputNeeded) {
          structured.verdict = 'INPUT NEEDED';
          structured.reasons = [];
          structured.advice = [];
        }
        if (isGuidance) {
          structured.verdict = 'GUIDANCE';
          structured.reasons = [];
          structured.advice = [];
        }

        if (obj.human_readable) {
          replyText = obj.human_readable;
        } else if ((isInputNeeded || isGuidance) && structured.summary) {
          replyText = structured.summary;
        } else {
          const after = replyText.slice(jsonMatch.index + jsonMatch[0].length).trim();
          if (after) replyText = `${replyText}\n\n${after}`;
          else replyText = replyText;
        }
      }
    } catch (e) {
      console.warn('Failed to parse AI JSON response:', e && e.message ? e.message : e);
    }

    res.json({ ok: true, reply: replyText, structured });

  } catch (err) {
    try {
      if (err && err.upstream && err.upstream.error && err.upstream.error.code === 429) {
        console.error('AI ERROR (upstream 429):', err.upstream.error.message || err.message);
      
        return res.status(429).json({ ok: false, error: err.upstream.error.message || 'Quota exceeded', upstream: err.upstream });
      }
    } catch (e) {
    }

    console.error('AI ERROR:', err && err.message ? err.message : err);

    res.status(500).json({
      ok: false,
      error: err && err.message ? err.message : 'Something went wrong'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 PhishNet AI backend running at http://localhost:${PORT}`);
});
