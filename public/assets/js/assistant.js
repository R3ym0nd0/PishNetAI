import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
marked.setOptions({ breaks: true });

const storageKey = 'phish_ai_chat';
const userKey = 'phish_ai_user';

const mainNav = document.querySelector('.main-nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');

const aiMessagesFull = document.getElementById('aiMessagesFull');
const aiFormFull = document.getElementById('aiFormFull');
const aiInputFull = document.getElementById('aiInputFull');
const userDisplay = document.getElementById('userDisplay');
const quickPrompts = document.querySelectorAll('.assistant-prompt');
const assistantChat = document.querySelector('.assistant-chat');
const NETLIFY_FRONTEND_ORIGIN = 'https://phishnetai.netlify.app';
const RENDER_API_BASE = 'https://phishnetai-fb30.onrender.com';

// Sidebar elements
const sidebar = document.getElementById('sidebar');
const menuToggleBtn = document.getElementById('menuToggleBtn');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
const mobileOverlay = document.getElementById('mobileOverlay');

// Sidebar state
let isSidebarOpen = false;

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

function showWelcomeMessage() {
    const existing = document.querySelector('.welcome-message');
    if (existing) existing.remove();
    const welcome = document.createElement('div');
    welcome.className = 'welcome-message';
    welcome.innerHTML = `
        <div class="welcome-icon">
            <img src="assets/images/logo.png" alt="PhishNet Logo" class="welcome-logo">
        </div>
        <h2>How can I help you today?</h2>
        <p>I'm Phinny, your phishing detection assistant. I can help you identify suspicious URLs, analyze messages, and stay safe online.</p>
    `;
    aiMessagesFull.appendChild(welcome);
}

function hideWelcomeMessage() {
    const welcome = document.querySelector('.welcome-message');
    if (welcome) welcome.remove();
}

function appendMessageFull(text, who = 'bot') {
    hideWelcomeMessage();
    const el = document.createElement('div');
    el.className = `ai-msg ${who}`;

    el.innerHTML = marked.parse(text);

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
    hideWelcomeMessage();
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
            showWelcomeMessage();
            return;
        }

        const messages = JSON.parse(raw);
        if (!messages.length) {
            showWelcomeMessage();
            return;
        }

        messages.forEach((message) => appendMessageFull(message.text, message.who));
    } catch (e) {
        console.warn('failed to parse history', e);
        showWelcomeMessage();
    }
}

async function sendAssistantMessage(message) {
    hideWelcomeMessage();
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
    const timeoutId = setTimeout(() => controller.abort(), 30000);

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

        let msg = 'Sorry - the AI request failed. Please try again.';
        if (err.message.includes('429')) {
            try {
                const parsed = JSON.parse(err.message.replace(/^Server error: \d+ /, ''));
                if (parsed.retryAfter) {
                    msg = `Rate limit exceeded. Please wait ${parsed.retryAfter} seconds.`;
                }
            } catch (e) {}
        }

        appendMessageFull(msg, 'bot');
        saveMessage(msg, 'bot');
    } finally {
        if (submitButton) submitButton.disabled = false;
        aiInputFull.disabled = false;
        aiInputFull.focus();
    }
}

function updateUserUI() {
    const name = localStorage.getItem(userKey);
    const signedIn = Boolean(name);
    if (userDisplay) {
        userDisplay.textContent = signedIn ? `Signed in as ${name}` : 'Not signed in';
    }
    document.body.classList.toggle('signed-in', signedIn);
    document.body.classList.toggle('not-signed-in', !signedIn);
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

// Enter key to send message
aiInputFull.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        aiFormFull.dispatchEvent(new Event('submit'));
    }
});

quickPrompts.forEach((button) => {
    button.addEventListener('click', async () => {
        const prompt = button.dataset.prompt;
        if (!prompt) return;
        aiInputFull.value = prompt;
        aiInputFull.focus();
    });
});

window.addEventListener('resize', () => {
    // Handle resize if needed
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeSidebar();
    }
});

updateUserUI();
loadHistory();

// ===== Sidebar Toggle Functions =====
function toggleSidebar() {
    if (!sidebar) return;
    isSidebarOpen = !isSidebarOpen;
    sidebar.classList.toggle('open', isSidebarOpen);
    if (mobileOverlay) {
        mobileOverlay.classList.toggle('active', isSidebarOpen);
    }
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
}

function closeSidebar() {
    if (!sidebar) return;
    isSidebarOpen = false;
    sidebar.classList.remove('open');
    if (mobileOverlay) {
        mobileOverlay.classList.remove('active');
    }
    document.body.style.overflow = '';
}

// Event Listeners for Sidebar Toggle
if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', toggleSidebar);
    menuToggleBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        toggleSidebar();
    });
}

if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeSidebar);
    mobileOverlay.addEventListener('touchend', (e) => {
        e.preventDefault();
        closeSidebar();
    });
}

if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
    sidebarCloseBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        closeSidebar();
    });
}

// Escape key to close sidebar
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
    }
});