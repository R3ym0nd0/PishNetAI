const urlForm = document.getElementById("urlForm");
const urlInput = document.getElementById("urlInput");
const resultSection = document.getElementById("resultSection");
const mainNav = document.querySelector(".main-nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a, .nav-links .nav-assistant");

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

if (urlForm) {
    urlForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const submittedUrl = urlInput.value.trim();

        console.log("URL submitted for future analysis:", submittedUrl);

        if (!submittedUrl) {
            return;
        }

        resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

let aiToggle = document.getElementById('aiToggle');
const aiWidget = document.getElementById('aiWidget');
const aiClose = document.getElementById('aiClose');
const aiForm = document.getElementById('aiForm');
const aiInput = document.getElementById('aiInput');
const aiMessages = document.getElementById('aiMessages');
const STORAGE_KEY = 'phish_ai_chat';
const aiFab = document.getElementById('aiFab');

let previousFocus = null;

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
        arr.forEach(m => {
            appendMessage(m.text, m.who);
        });
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
           
            setTimeout(()=> aiInput && aiInput.focus(), 50);
            enableFocusTrap();
            if (mobile) {
                aiWidget.classList.add('fullscreen');
                document.body.classList.add('noscroll');
                if (aiFab) aiFab.style.display = 'none';
            }
        } else {
            disableFocusTrap();
            try {
                if (aiWidget.contains(document.activeElement)) document.activeElement.blur();
            } catch(e){}
            if (previousFocus && typeof previousFocus.focus === 'function') {
                previousFocus.focus();
            } else if (aiToggle && typeof aiToggle.focus === 'function') {
                aiToggle.focus();
            } else {
                try { document.body.focus(); } catch(e){}
            }

            if (mobile) {
                aiWidget.classList.remove('fullscreen');
                document.body.classList.remove('noscroll');
                if (aiFab) aiFab.style.display = 'inline-flex';
            }

            aiWidget.setAttribute('aria-hidden', 'true');
            aiToggle.setAttribute('aria-expanded', 'false');
            if (aiToggle) aiToggle.style.display = '';
        }
    };
    aiToggle._handlerRef = handler;
    aiToggle.addEventListener('click', handler);
}

addAiToggleListener();

if (aiClose) {
    aiClose.addEventListener('click', () => {
        disableFocusTrap();
        try { if (aiWidget.contains(document.activeElement)) document.activeElement.blur(); } catch(e){}
        if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
        else if (aiToggle && typeof aiToggle.focus === 'function') aiToggle.focus();

        if (window.matchMedia('(max-width:520px)').matches) {
            aiWidget.classList.remove('fullscreen');
            document.body.classList.remove('noscroll');
            if (aiFab) aiFab.style.display = 'inline-flex';
        }

        aiWidget.setAttribute('aria-hidden', 'true');
        aiToggle && aiToggle.setAttribute('aria-expanded', 'false');
        if (aiToggle) aiToggle.style.display = '';
    });
}

if (aiForm) {
    aiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = aiInput.value.trim();
        if (!v) return;
        appendMessage(v, 'user');
        aiInput.value = '';
        setTimeout(() => {
            appendMessage('AI assistant response is not available in this mock script.', 'bot');
        }, 700);
    });
}

function onDocumentKey(e){
    if (e.key === 'Escape'){
        if (aiWidget && aiWidget.getAttribute('aria-hidden') === 'false'){
            disableFocusTrap();
            try { if (aiWidget.contains(document.activeElement)) document.activeElement.blur(); } catch(e){}
            if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
            else if (aiToggle && typeof aiToggle.focus === 'function') aiToggle.focus();

            if (window.matchMedia('(max-width:520px)').matches) {
                aiWidget.classList.remove('fullscreen');
                document.body.classList.remove('noscroll');
                if (aiFab) aiFab.style.display = 'inline-flex';
            }

            aiWidget.setAttribute('aria-hidden','true');
            aiToggle && aiToggle.setAttribute('aria-expanded','false');
            if (aiToggle) aiToggle.style.display = '';
        }
    }
}

document.addEventListener('keydown', onDocumentKey);

let focusTrapHandler = null;
function enableFocusTrap(){
    const focusable = 'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])';
    const container = aiWidget;
    const nodes = container.querySelectorAll(focusable);
    const nodeArr = Array.prototype.slice.call(nodes).filter(n=>!n.hasAttribute('disabled'));
    if (!nodeArr.length) return;
    let first = nodeArr[0];
    let last = nodeArr[nodeArr.length-1];
    focusTrapHandler = function(e){
        if (e.key !== 'Tab') return;
        if (e.shiftKey){
            if (document.activeElement === first){
                e.preventDefault(); last.focus();
            }
        } else {
            if (document.activeElement === last){
                e.preventDefault(); first.focus();
            }
        }
    };
    container.addEventListener('keydown', focusTrapHandler);
}

function disableFocusTrap(){
    if (!aiWidget || !focusTrapHandler) return;
    aiWidget.removeEventListener('keydown', focusTrapHandler);
    focusTrapHandler = null;
}

if (aiWidget && aiWidget.getAttribute('aria-hidden') === 'false') loadHistoryToWidget();

if (aiFab) {
    aiFab.addEventListener('click', () => {
        aiWidget.setAttribute('aria-hidden', 'false');
        aiWidget.classList.add('fullscreen');
        aiToggle && aiToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('noscroll');
        if (aiFab) aiFab.style.display = 'none';
        loadHistoryToWidget();
        setTimeout(()=> aiInput.focus(), 60);
        enableFocusTrap();
    });
}
function restoreAiToggleIfNeeded(){
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    const existing = document.getElementById('aiToggle');
    if (existing) {
        try {
            existing.style.display = '';
            existing.style.visibility = '';
            existing.removeAttribute('hidden');
        } catch(e){}

        aiToggle = existing;
        addAiToggleListener();
        return;
    }

    const btn = document.createElement('button');
    btn.id = 'aiToggle';
    btn.className = 'nav-assistant';
    btn.type = 'button';
    btn.title = 'Open AI Assistant';
    btn.setAttribute('aria-controls','aiWidget');
    btn.setAttribute('aria-expanded','false');
    btn.textContent = 'AI Assistant';
  
    const navLinksStyle = window.getComputedStyle(navLinks);
    if (navLinksStyle && navLinksStyle.display === 'none') {
        const brand = document.querySelector('.nav-brand') || document.querySelector('.main-nav');
        if (brand) {
            brand.appendChild(btn);
        } else {
            navLinks.appendChild(btn);
        }
    } else {
        navLinks.appendChild(btn);
    }
    aiToggle = btn;
    addAiToggleListener();
}

const observer = new MutationObserver((mutations) => {
    const t = document.getElementById('aiToggle');
    if (!t || (t && (t.offsetParent === null && getComputedStyle(t).display === 'none'))) {
        setTimeout(restoreAiToggleIfNeeded, 40);
    }
});
observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'hidden'] });

restoreAiToggleIfNeeded();

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
        if (!email) {
            feedback.textContent = 'Please provide an email address.';
            feedback.classList.remove('success'); feedback.classList.add('error');
            return;
        }

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
            } else {
                throw new Error('Network response not OK');
            }
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
