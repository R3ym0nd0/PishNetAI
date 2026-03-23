const storageKey = 'phish_ai_chat';
const userKey = 'phish_ai_user';

const mainNav = document.querySelector('.main-nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');

const aiMessagesFull = document.getElementById('aiMessagesFull');
const aiFormFull = document.getElementById('aiFormFull');
const aiInputFull = document.getElementById('aiInputFull');
const loginPanel = document.getElementById('loginPanel');
const showLogin = document.getElementById('showLogin');
const showSignup = document.getElementById('showSignup');
const doLogin = document.getElementById('doLogin');
const usernameField = document.getElementById('username');
const userDisplay = document.getElementById('userDisplay');
const quickPrompts = document.querySelectorAll('.assistant-prompt');
const authModeLabel = document.getElementById('authModeLabel');
const collapsibleCards = document.querySelectorAll('.assistant-collapsible');
const NETLIFY_FRONTEND_ORIGIN = 'https://phishnetai.netlify.app';
const RENDER_API_BASE = 'https://phishnetai-fb30.onrender.com';

function getApiBase() {
    const { origin, hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return origin;
    }
    if (origin === NETLIFY_FRONTEND_ORIGIN) {
        return RENDER_API_BASE;
    }
    return origin;
}

function appendMessageFull(text, who = 'bot') {
    const el = document.createElement('div');
    el.className = `ai-msg ${who}`;
    el.textContent = text;
    aiMessagesFull.appendChild(el);
    aiMessagesFull.scrollTop = aiMessagesFull.scrollHeight;
}

function saveMessage(text, who) {
    try {
        const raw = localStorage.getItem(storageKey);
        const arr = raw ? JSON.parse(raw) : [];
        arr.push({ text, who, at: Date.now() });
        localStorage.setItem(storageKey, JSON.stringify(arr.slice(-200)));
    } catch (e) {
        console.warn('failed to store message', e);
    }
}

function isCompactAssistantReply(structured) {
    const verdict = String(structured?.verdict || structured?.raw?.verdict || '').trim().toUpperCase();
    return verdict === 'INPUT NEEDED' || verdict === 'ANALYSIS NOT APPLICABLE' || verdict === 'GUIDANCE';
}

function renderStructuredMessageFull(structured, humanText) {
    const container = document.createElement('div');
    container.className = 'ai-msg bot ai-structured';

    const compactReply = isCompactAssistantReply(structured);
    if (compactReply) {
        container.classList.add('ai-compact');
    }

    const header = document.createElement('div');
    header.className = 'ai-structured-header';

    const verdict = document.createElement('span');
    verdict.className = 'ai-verdict';
    verdict.textContent = structured.verdict || (structured.raw && structured.raw.verdict) || 'Unknown';
    header.appendChild(verdict);

    if (structured.summary) {
        const sum = document.createElement('span');
        sum.className = 'ai-summary';
        sum.textContent = structured.summary;
        header.appendChild(sum);
    }

    container.appendChild(header);

    if (!compactReply && structured.reasons && structured.reasons.length) {
        const rTitle = document.createElement('div');
        rTitle.className = 'ai-section-title';
        rTitle.textContent = 'Reasons';
        container.appendChild(rTitle);

        const ul = document.createElement('ul');
        ul.className = 'ai-reasons';
        structured.reasons.forEach((reason) => {
            const li = document.createElement('li');
            li.textContent = reason;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }

    if (!compactReply && structured.advice && structured.advice.length) {
        const aTitle = document.createElement('div');
        aTitle.className = 'ai-section-title';
        aTitle.textContent = 'Advice';
        container.appendChild(aTitle);

        const ul = document.createElement('ul');
        ul.className = 'ai-advice';
        structured.advice.forEach((advice) => {
            const li = document.createElement('li');
            li.textContent = advice;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }

    const fallbackText = humanText && structured.summary && humanText.trim() === structured.summary.trim()
        ? ''
        : humanText;

    if (fallbackText) {
        const hr = document.createElement('div');
        hr.className = 'ai-human-text';
        hr.textContent = fallbackText;
        container.appendChild(hr);
    }

    aiMessagesFull.appendChild(container);
    aiMessagesFull.scrollTop = aiMessagesFull.scrollHeight;
    saveMessage(fallbackText || structured.summary || JSON.stringify(structured), 'bot');
}

function loadHistory() {
    try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) {
            appendMessageFull('Hello. I am Phinny, your phishing-focused assistant. Paste a suspicious URL, message, or ask what to do next.');
            return;
        }

        const messages = JSON.parse(raw);
        if (!messages.length) {
            appendMessageFull('Hello. I am Phinny, your phishing-focused assistant. Paste a suspicious URL, message, or ask what to do next.');
            return;
        }

        messages.forEach((message) => appendMessageFull(message.text, message.who));
    } catch (e) {
        console.warn('failed to parse history', e);
        appendMessageFull('Hello. I am Phinny, your phishing-focused assistant. Paste a suspicious URL, message, or ask what to do next.');
    }
}

async function sendAssistantMessage(message) {
    appendMessageFull(message, 'user');
    saveMessage(message, 'user');

    aiInputFull.value = '';
    aiInputFull.disabled = true;
    const submitButton = aiFormFull.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    const pendingEl = document.createElement('div');
    pendingEl.className = 'ai-msg bot pending';
    pendingEl.textContent = 'Thinking';
    aiMessagesFull.appendChild(pendingEl);
    aiMessagesFull.scrollTop = aiMessagesFull.scrollHeight;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
        const resp = await fetch(`${getApiBase()}/api/ai-chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ message }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!resp.ok) {
            const txt = await resp.text();
            throw new Error(`Server error: ${resp.status} ${txt}`);
        }

        const data = await resp.json();
        try { pendingEl.parentNode && pendingEl.parentNode.removeChild(pendingEl); } catch (e) {}

        if (data && data.ok) {
            if (data.structured && data.structured.verdict) {
                renderStructuredMessageFull(data.structured, data.reply);
            } else if (data.reply) {
                appendMessageFull(data.reply, 'bot');
                saveMessage(data.reply, 'bot');
            } else {
                throw new Error('No reply from AI');
            }
        } else {
            throw new Error(data && data.error ? data.error : 'No reply from AI');
        }
    } catch (err) {
        clearTimeout(timeoutId);
        console.error('assistant request failed', err);
        try { pendingEl.parentNode && pendingEl.parentNode.removeChild(pendingEl); } catch (e) {}
        appendMessageFull('Sorry - the AI request failed. Please try again.', 'bot');
        saveMessage('Sorry - the AI request failed. Please try again.', 'bot');
    } finally {
        if (submitButton) submitButton.disabled = false;
        aiInputFull.disabled = false;
        aiInputFull.focus();
    }
}

function updateUserUI() {
    const name = localStorage.getItem(userKey);
    const signedIn = Boolean(name);
    userDisplay.textContent = signedIn ? `Signed in as ${name}` : 'Not signed in';
    document.body.classList.toggle('signed-in', signedIn);
    document.body.classList.toggle('not-signed-in', !signedIn);
}

function applyMobileCardState() {
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    collapsibleCards.forEach((card) => {
        const toggle = card.querySelector('.assistant-collapse-toggle');
        if (!toggle) return;

        if (mobile) {
            card.classList.add('is-collapsed');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.textContent = 'Show';
        } else {
            card.classList.remove('is-collapsed');
            toggle.setAttribute('aria-expanded', 'true');
            toggle.textContent = 'Hide';
        }
    });
}

if (mainNav && navToggle) {
    navToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

aiFormFull.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = aiInputFull.value.trim();
    if (!value) return;
    await sendAssistantMessage(value);
});

quickPrompts.forEach((button) => {
    button.addEventListener('click', async () => {
        const prompt = button.dataset.prompt;
        if (!prompt) return;
        aiInputFull.value = prompt;
        aiInputFull.focus();
    });
});

showLogin.addEventListener('click', () => {
    if (authModeLabel) authModeLabel.textContent = 'Sign in (mock)';
    loginPanel.classList.toggle('show');
});

if (showSignup) {
    showSignup.addEventListener('click', () => {
        if (authModeLabel) authModeLabel.textContent = 'Sign up (mock)';
        loginPanel.classList.add('show');
        usernameField.focus();
    });
}

doLogin.addEventListener('click', () => {
    const value = usernameField.value.trim();
    if (!value) {
        alert('Enter a name');
        return;
    }

    localStorage.setItem(userKey, value);
    loginPanel.classList.remove('show');
    updateUserUI();
});

collapsibleCards.forEach((card) => {
    const toggle = card.querySelector('.assistant-collapse-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const collapsed = card.classList.toggle('is-collapsed');
        toggle.setAttribute('aria-expanded', String(!collapsed));
        toggle.textContent = collapsed ? 'Show' : 'Hide';
    });
});

window.addEventListener('resize', applyMobileCardState);

updateUserUI();
loadHistory();
applyMobileCardState();
