// === DOM Elements ===
const urlForm = document.getElementById("urlForm");
const urlInput = document.getElementById("urlInput");
const resultSection = document.getElementById("resultSection");
const mainNav = document.querySelector(".main-nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a, .nav-links .nav-assistant");

let aiToggle = document.getElementById('aiToggle');
const aiWidget = document.getElementById('aiWidget');
const aiClose = document.getElementById('aiClose');
const aiForm = document.getElementById('aiForm');
const aiInput = document.getElementById('aiInput');
const aiMessages = document.getElementById('aiMessages');
const STORAGE_KEY = 'phish_ai_chat';
const aiFab = document.getElementById('aiFab');

const NETLIFY_FRONTEND_ORIGIN = 'https://phishnetai.netlify.app';
const RENDER_API_BASE = 'https://phishnetai-fb30.onrender.com';

let previousFocus = null;
let focusTrapHandler = null;

// === Navigation toggle ===
if (mainNav && navToggle) {
    navToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("nav-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// === URL Form Scroll ===
if (urlForm) {
    urlForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const submittedUrl = urlInput.value.trim();
        console.log("URL submitted for future analysis:", submittedUrl);
        if (!submittedUrl) return;
        resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

// === Local Storage Chat ===
function saveMessage(text, who='bot'){
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        arr.push({ text, who, at: Date.now() });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(-200)));
    } catch(e) { console.warn('store failed', e); }
}

function loadHistoryToWidget(){
    if (!aiMessages) return;
    aiMessages.innerHTML = '';
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const arr = JSON.parse(raw);
        arr.forEach(m => appendMessage(m.text, m.who));
    } catch(e){ console.warn('load failed', e); }
}

function appendMessage(text, who = 'bot') {
    const el = document.createElement('div');
    el.className = `ai-msg ${who}`;
    el.textContent = text;
    aiMessages.appendChild(el);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    saveMessage(text, who);
}

function getApiBase() {
    const { origin, hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return origin;
    if (origin === NETLIFY_FRONTEND_ORIGIN) return RENDER_API_BASE;
    return origin;
}

// === AI Toggle ===
function addAiToggleListener() {
    if (!aiToggle || !aiWidget) return;
    try { aiToggle.removeEventListener && aiToggle.removeEventListener('click', aiToggle._handlerRef); } catch(e){}
    const handler = () => {
        const isVisible = aiWidget.getAttribute('aria-hidden') === 'false';
        const mobile = window.matchMedia('(max-width:520px)').matches;

        if (!isVisible) {
            previousFocus = document.activeElement;
            aiWidget.setAttribute('aria-hidden', 'false');
            aiToggle.setAttribute('aria-expanded', 'true');
            loadHistoryToWidget();
            if (aiFab) aiFab.style.display = 'none';
            setTimeout(()=> aiInput && aiInput.focus(), 50);
            enableFocusTrap();
            if (mobile) {
                aiWidget.classList.add('fullscreen');
                document.body.classList.add('noscroll');
            }
        } else {
            disableFocusTrap();
            try { if (aiWidget.contains(document.activeElement)) document.activeElement.blur(); } catch(e){}
            previousFocus?.focus?.() || aiToggle?.focus?.();
            if (aiFab) aiFab.style.display = 'inline-flex';
            aiWidget.classList.remove('fullscreen');
            document.body.classList.remove('noscroll');
            aiWidget.setAttribute('aria-hidden', 'true');
            aiToggle.setAttribute('aria-expanded', 'false');
        }
    };
    aiToggle._handlerRef = handler;
    aiToggle.addEventListener('click', handler);
}
addAiToggleListener();

// === Close AI Widget ===
if (aiClose) {
    aiClose.addEventListener('click', () => {
        disableFocusTrap();
        try { if (aiWidget.contains(document.activeElement)) document.activeElement.blur(); } catch(e){}
        previousFocus?.focus?.() || aiToggle?.focus?.();
        aiWidget.setAttribute('aria-hidden', 'true');
        aiToggle?.setAttribute('aria-expanded', 'false');
        if (aiFab) aiFab.style.display = 'inline-flex';
        aiWidget.classList.remove('fullscreen');
        document.body.classList.remove('noscroll');
    });
}

// === Restore AI Toggle if hidden ===
function restoreAiToggleIfNeeded(){
    const navLinksEl = document.querySelector('.nav-links');
    if (!navLinksEl) return;

    if (!aiToggle) {
        const btn = document.createElement('button');
        btn.id = 'aiToggle';
        btn.className = 'nav-assistant';
        btn.type = 'button';
        btn.title = 'Open AI Assistant';
        btn.setAttribute('aria-controls','aiWidget');
        btn.setAttribute('aria-expanded','false');
        btn.textContent = 'AI Assistant';
        navLinksEl.appendChild(btn);
        aiToggle = btn;
        addAiToggleListener();
    } else {
        aiToggle.style.display = '';
        aiToggle.setAttribute('aria-expanded','false');
    }
}
const observer = new MutationObserver(()=> restoreAiToggleIfNeeded());
observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style','class','hidden'] });
restoreAiToggleIfNeeded();

// === AI Fab Click ===
if (aiFab) {
    aiFab.addEventListener('click', () => {
        aiWidget.setAttribute('aria-hidden', 'false');
        aiWidget.classList.add('fullscreen');
        aiToggle?.setAttribute('aria-expanded', 'true');
        document.body.classList.add('noscroll');
        aiFab.style.display = 'none';
        loadHistoryToWidget();
        setTimeout(()=> aiInput.focus(), 60);
        enableFocusTrap();
    });
}

let aiCooldown = 0;
let aiCooldownInterval = null;

function startAiCooldown(seconds) {
    aiCooldown = seconds;
    aiInput.disabled = true;
    const pendingEl = document.createElement('div');
    pendingEl.className = 'ai-msg bot pending';
    pendingEl.id = 'aiCooldownMsg';
    pendingEl.textContent = `Rate limit hit! Please wait ${aiCooldown} seconds...`;
    aiMessages.appendChild(pendingEl);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    aiCooldownInterval = setInterval(() => {
        aiCooldown--;
        pendingEl.textContent = `Rate limit hit! Please wait ${aiCooldown} seconds...`;
        if (aiCooldown <= 0) {
            clearInterval(aiCooldownInterval);
            aiCooldownInterval = null;
            pendingEl.remove();
            aiInput.disabled = false;
            aiInput.focus();
        }
    }, 1000);
}

// === AI Form Submission ===
if (aiForm) {
    aiForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (aiCooldown > 0) return; // prevent sending if cooldown active

        const v = aiInput.value.trim();
        if (!v) return;

        appendMessage(v, 'user');
        aiInput.value = '';

        const submitBtn = aiForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        aiInput.disabled = true;

        const pendingEl = document.createElement('div');
        pendingEl.className = 'ai-msg bot pending';
        pendingEl.textContent = 'Thinking...';
        aiMessages.appendChild(pendingEl);
        aiMessages.scrollTop = aiMessages.scrollHeight;

        const controller = new AbortController();
        const timeoutMs = 12000;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const resp = await fetch(`${getApiBase()}/api/ai-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ message: v }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            pendingEl.remove();

            if (resp.status === 429) {
                const data = await resp.json(); 
                const cooldown = Number(data.retryAfter) || 10;
                startAiCooldown(cooldown);
                return;
            }

            const data = await resp.json();
            if (data && data.ok) {
                appendMessage(data.reply || 'AI replied, but no text.', 'bot');
            } else {
                throw new Error(data?.error || 'No reply from AI');
            }
        } catch (err) {
            clearTimeout(timeoutId);
            console.error('AI request failed', err);
            pendingEl.remove();
            appendMessage('Sorry — the AI request failed. Please try again.', 'bot');
        } finally {
            if (!aiCooldown) { // don't re-enable during cooldown
                if (submitBtn) submitBtn.disabled = false;
                aiInput.disabled = false;
                aiInput.focus();
            }
        }
    });
}

// === Escape key to close AI ===
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (aiWidget?.getAttribute('aria-hidden') === 'false') {
        disableFocusTrap();
        try { if (aiWidget.contains(document.activeElement)) document.activeElement.blur(); } catch(e){}
        previousFocus?.focus?.() || aiToggle?.focus?.();
        if (window.matchMedia('(max-width:520px)').matches) {
            aiWidget.classList.remove('fullscreen');
            document.body.classList.remove('noscroll');
            if (aiFab) aiFab.style.display = 'inline-flex';
        }
        aiWidget.setAttribute('aria-hidden','true');
        aiToggle?.setAttribute('aria-expanded','false');
        if (aiToggle) aiToggle.style.display = '';
    }
});

// === Focus Trap ===
function enableFocusTrap(){
    if (!aiWidget) return;
    const focusable = 'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])';
    const nodes = Array.from(aiWidget.querySelectorAll(focusable)).filter(n=>!n.hasAttribute('disabled'));
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length-1];
    focusTrapHandler = (e) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    aiWidget.addEventListener('keydown', focusTrapHandler);
}
function disableFocusTrap(){
    if (!aiWidget || !focusTrapHandler) return;
    aiWidget.removeEventListener('keydown', focusTrapHandler);
    focusTrapHandler = null;
}

// === Newsletter Form ===
(function(){
    const form = document.getElementById('newsletterForm');
    const input = document.getElementById('newsletterEmail');
    if (!form || !input) return;

    const feedback = document.createElement('div');
    feedback.className = 'newsletter-feedback';
    form.parentNode.insertBefore(feedback, form.nextSibling);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = input.value.trim();
        if (!email) { feedback.textContent = 'Please provide an email address.'; feedback.classList.remove('success'); feedback.classList.add('error'); return; }

        const btn = form.querySelector('button[type="submit"]');
        if (btn) btn.disabled = true;
        feedback.textContent = 'Sending...';
        feedback.classList.remove('error','success');

        const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

        try {
            const res = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                feedback.textContent = 'Thanks — you are subscribed (or will be shortly).';
                feedback.classList.remove('error'); feedback.classList.add('success');
                input.value = '';
                const saved = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
                saved.push({ email, at: Date.now(), sent: true });
                localStorage.setItem('newsletter_emails', JSON.stringify(saved));
            } else throw new Error('Network response not OK');
        } catch (err) {
            const saved = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
            saved.push({ email, at: Date.now(), sent: false });
            localStorage.setItem('newsletter_emails', JSON.stringify(saved));
            feedback.textContent = 'Saved';
            feedback.classList.remove('success'); feedback.classList.add('error');
        } finally {
            if (btn) btn.disabled = false;
            setTimeout(() => { feedback.textContent = ''; feedback.classList.remove('error','success'); }, 6000);
        }
    });
})();