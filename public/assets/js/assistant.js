import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
marked.setOptions({ breaks: true });

const authTokenKey = 'phish_ai_token';
const authUserKey = 'phish_ai_user';
const activeChatKey = 'phish_ai_active_chat';
const AI_HISTORY_LIMIT = 16;

const mainNav = document.querySelector('.main-nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');

const aiMessagesFull = document.getElementById('aiMessagesFull');
const aiFormFull = document.getElementById('aiFormFull');
const aiInputFull = document.getElementById('aiInputFull');
const userDisplay = document.getElementById('userDisplay');
const profileCard = document.getElementById('profileCard');
const profileName = document.getElementById('profileName');
const chatTitle = document.querySelector('.chat-title');
const chatList = document.getElementById('chatList');
const newChatBtn = document.getElementById('newChatBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authActions = document.getElementById('authActions');
const signupBtn = document.getElementById('signupBtn');
const signinBtn = document.getElementById('signinBtn');
const confirmOverlay = document.getElementById('confirmOverlay');
const confirmTitle = document.getElementById('confirmTitle');
const confirmText = document.getElementById('confirmText');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

const sidebar = document.getElementById('sidebar');
const menuToggleBtn = document.getElementById('menuToggleBtn');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
const mobileOverlay = document.getElementById('mobileOverlay');

const DEPLOY_FRONTEND_ORIGINS = new Set([
    'https://phishnetai.netlify.app',
    'https://pishnetai.vercel.app'
]);
const RENDER_API_BASE = 'https://phishnetai-fb30.onrender.com';

let isSidebarOpen = false;
let currentUser = null;
let currentChatId = null;
let assistantConversationHistory = [];
let chatSummaries = [];
let openChatMenuId = null;
let pendingDeleteChat = null;
let pendingConfirmAction = null;

function getApiBase() {
    const { origin, hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return origin;
    if (DEPLOY_FRONTEND_ORIGINS.has(origin)) return RENDER_API_BASE;
    return origin;
}

function getStoredToken() {
    return localStorage.getItem(authTokenKey) || sessionStorage.getItem(authTokenKey) || '';
}

function getActiveChatId() {
    return localStorage.getItem(activeChatKey) || sessionStorage.getItem(activeChatKey) || '';
}

function getAuthStorage() {
    if (localStorage.getItem(authTokenKey)) return localStorage;
    if (sessionStorage.getItem(authTokenKey)) return sessionStorage;
    return localStorage;
}

function setActiveChatId(chatId) {
    const storage = getAuthStorage();

    if (chatId) {
        localStorage.removeItem(activeChatKey);
        sessionStorage.removeItem(activeChatKey);
        storage.setItem(activeChatKey, chatId);
    } else {
        localStorage.removeItem(activeChatKey);
        sessionStorage.removeItem(activeChatKey);
    }
}

function clearStoredAuth() {
    localStorage.removeItem(authTokenKey);
    localStorage.removeItem(authUserKey);
    localStorage.removeItem(activeChatKey);
    sessionStorage.removeItem(authTokenKey);
    sessionStorage.removeItem(authUserKey);
    sessionStorage.removeItem(activeChatKey);
}

function setStoredAuth(token, user) {
    if (!token) {
        clearStoredAuth();
        return;
    }

    const storage = getAuthStorage();
    storage.setItem(authTokenKey, token);

    if (user?.name) {
        storage.setItem(authUserKey, user.name);
    } else {
        storage.removeItem(authUserKey);
    }
}

function getAuthHeaders() {
    const token = getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(path, options = {}) {
    const headers = {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...getAuthHeaders(),
        ...(options.headers || {})
    };

    const response = await fetch(`${getApiBase()}${path}`, {
        ...options,
        headers
    });

    const text = await response.text();
    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch (error) {
        data = { ok: false, error: text || 'Unexpected response from server.' };
    }

    if (!response.ok) {
        const err = new Error(data.error || `Request failed with status ${response.status}`);
        err.status = response.status;
        err.data = data;
        throw err;
    }

    return data;
}

function showWelcomeMessage() {
    const existing = document.querySelector('.welcome-message');
    if (existing) existing.remove();

    const welcome = document.createElement('div');
    welcome.className = 'welcome-message';
    welcome.innerHTML = `
        <div class="assistant-intro-copy">
            <img src="assets/images/logo.png" alt="PhishNet AI logo" class="assistant-intro-logo welcome-logo">
            <h2>How can I help you today?</h2>
            <p>I'm Phinny, your phishing-focused assistant. Ask about a suspicious link, message, or what to do next.</p>
        </div>
        <div class="assistant-prompt-grid">
            <button type="button" class="assistant-prompt-card" data-assistant-prompt="Check this suspicious link for phishing signs.">
                <span class="assistant-prompt-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 3a7.5 7.5 0 1 0 4.61 13.42l4.23 4.22 1.06-1.06-4.22-4.23A7.5 7.5 0 0 0 10.5 3zm0 1.5a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"/><path d="M10.5 7.25a.75.75 0 0 1 .75.75v1.75H13a.75.75 0 0 1 0 1.5h-1.75V13a.75.75 0 0 1-1.5 0v-1.75H8a.75.75 0 0 1 0-1.5h1.75V8a.75.75 0 0 1 .75-.75z"/></svg>
                </span>
                <strong>Check link</strong>
            </button>
            <button type="button" class="assistant-prompt-card" data-assistant-prompt="What are the common signs of a phishing website?">
                <span class="assistant-prompt-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 4 7v5c0 4.97 3.06 8.87 8 10 4.94-1.13 8-5.03 8-10V7l-8-4zm0 1.68 6.5 3.25V12c0 4.12-2.4 7.33-6.5 8.39C7.9 19.33 5.5 16.12 5.5 12V7.93L12 4.68z"/><path d="M11.25 8.25h1.5v5h-1.5zm0 6.5h1.5v1.5h-1.5z"/></svg>
                </span>
                <strong>Phishing signs</strong>
            </button>
            <button type="button" class="assistant-prompt-card" data-assistant-prompt="How can I stay safe before logging in to a website?">
                <span class="assistant-prompt-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 5 5v5c0 4.55 2.91 8.77 7 10 4.09-1.23 7-5.45 7-10V5l-7-3zm0 1.64 5.5 2.36V10c0 3.8-2.32 7.21-5.5 8.34C8.82 17.21 6.5 13.8 6.5 10V6l5.5-2.36z"/><path d="M10.4 11.6 9.1 10.3 8 11.4l2.4 2.4 5.6-5.6-1.1-1.1z"/></svg>
                </span>
                <strong>Stay safe</strong>
            </button>
            <button type="button" class="assistant-prompt-card" data-assistant-prompt="Help me understand this suspicious message or scam.">
                <span class="assistant-prompt-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2zm0 1.5a.5.5 0 0 0-.5.5v10.38L7.38 14.5H19a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5H5z"/><path d="M8 8h8v1.5H8zm0 3h5v1.5H8z"/></svg>
                </span>
                <strong>Scam help</strong>
            </button>
        </div>
    `;
    aiMessagesFull.appendChild(welcome);

    welcome.querySelectorAll('[data-assistant-prompt]').forEach((button) => {
        button.addEventListener('click', async () => {
            const prompt = button.getAttribute('data-assistant-prompt') || '';
            if (!prompt) return;
            aiInputFull.value = prompt;
            await sendAssistantMessage(prompt);
        });
    });
}

function hideWelcomeMessage() {
    const welcome = document.querySelector('.welcome-message');
    if (welcome) welcome.remove();
}

function appendMessageFull(text, who = 'bot') {
    hideWelcomeMessage();
    const el = document.createElement('div');
    el.className = `ai-msg ${who}`;
    el.innerHTML = marked.parse(String(text || ''));
    aiMessagesFull.appendChild(el);
    aiMessagesFull.scrollTop = aiMessagesFull.scrollHeight;
}

function renderConversation() {
    aiMessagesFull.innerHTML = '';

    if (!assistantConversationHistory.length) {
        showWelcomeMessage();
        return;
    }

    assistantConversationHistory.forEach((entry) => {
        appendMessageFull(entry.content, entry.role === 'assistant' ? 'bot' : 'user');
    });
}

function resetConversation(title = 'New Chat') {
    currentChatId = null;
    setActiveChatId('');
    assistantConversationHistory = [];
    if (chatTitle) chatTitle.textContent = title;
    renderConversation();
    renderChatList();
}

function getRecentAssistantHistory() {
    return assistantConversationHistory.slice(-AI_HISTORY_LIMIT);
}

function formatChatTime(value) {
    if (!value) return '';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
    }).format(new Date(value));
}

function getShortDisplayTitle(title, maxLength = 44) {
    const cleaned = String(title || '').replace(/\s+/g, ' ').trim();
    if (!cleaned) return 'New Chat';
    return cleaned.length > maxLength
        ? `${cleaned.slice(0, maxLength).trim()}...`
        : cleaned;
}

function renderGuestHistoryState() {
    if (!chatList) return;
    chatList.innerHTML = `
        <li class="chat-item chat-item-empty">
            <span>Sign in to save your chats and revisit them later.</span>
        </li>
    `;
}

function openDeleteConfirm(chat) {
    pendingDeleteChat = chat;
    pendingConfirmAction = 'delete';
    if (confirmTitle) {
        confirmTitle.textContent = 'Delete chat?';
    }
    if (confirmText) {
        const shortTitle = getShortDisplayTitle(chat.title, 36);
        confirmText.textContent = `Delete "${shortTitle}" from your saved history? This cannot be undone.`;
    }
    if (confirmDeleteBtn) {
        confirmDeleteBtn.textContent = 'Delete';
    }
    if (confirmOverlay) {
        confirmOverlay.hidden = false;
    }
    confirmDeleteBtn?.focus();
}

function closeDeleteConfirm() {
    pendingDeleteChat = null;
    pendingConfirmAction = null;
    if (confirmOverlay) {
        confirmOverlay.hidden = true;
    }
}

function openLogoutConfirm() {
    pendingDeleteChat = null;
    pendingConfirmAction = 'logout';
    if (confirmTitle) {
        confirmTitle.textContent = 'Logout?';
    }
    if (confirmText) {
        confirmText.textContent = 'You will be signed out of your current session. You can sign back in anytime.';
    }
    if (confirmDeleteBtn) {
        confirmDeleteBtn.textContent = 'Logout';
    }
    if (confirmOverlay) {
        confirmOverlay.hidden = false;
    }
    confirmDeleteBtn?.focus();
}

function renderChatList() {
    if (!chatList) return;

    if (!currentUser) {
        renderGuestHistoryState();
        return;
    }

    if (!chatSummaries.length) {
        chatList.innerHTML = `
            <li class="chat-item chat-item-empty">
                <span>No saved chats yet. Start a new conversation.</span>
            </li>
        `;
        return;
    }

    chatList.innerHTML = '';
    chatSummaries.forEach((chat) => {
        const item = document.createElement('li');
        item.className = `chat-item${chat.id === currentChatId ? ' active' : ''}`;
        item.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zM17 11V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
            </svg>
            <span>${chat.title}</span>
            <div class="chat-item-actions">
                <button type="button" class="chat-item-menu-btn" aria-label="Chat options" aria-expanded="${openChatMenuId === chat.id ? 'true' : 'false'}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="2"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                        <circle cx="12" cy="19" r="2"></circle>
                    </svg>
                </button>
                <div class="chat-item-menu" ${openChatMenuId === chat.id ? '' : 'hidden'}>
                    <button type="button" class="chat-delete-btn">Delete chat</button>
                </div>
            </div>
        `;
        item.title = `${chat.title} • ${formatChatTime(chat.updatedAt)}`;
        item.addEventListener('click', async () => {
            await loadChat(chat.id);
            closeSidebar();
        });

        const menuBtn = item.querySelector('.chat-item-menu-btn');
        const menu = item.querySelector('.chat-item-menu');
        const deleteBtn = item.querySelector('.chat-delete-btn');

        menuBtn?.addEventListener('click', (event) => {
            event.stopPropagation();
            openChatMenuId = openChatMenuId === chat.id ? null : chat.id;
            renderChatList();
        });

        menu?.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        deleteBtn?.addEventListener('click', (event) => {
            event.stopPropagation();
            openDeleteConfirm(chat);
        });

        chatList.appendChild(item);
    });
}

async function deleteChatById(chatId) {
    if (!currentUser || !chatId) return;

    try {
        await apiFetch(`/api/chats/${chatId}`, { method: 'DELETE' });
        openChatMenuId = null;

        if (currentChatId === chatId) {
            resetConversation('New Chat');
        }

        await loadChatSummaries();
    } catch (error) {
        console.error('Failed to delete chat', error);
        if (confirmText) {
            confirmText.textContent = error.message || 'Could not delete chat right now.';
        }
        if (confirmOverlay) {
            confirmOverlay.hidden = false;
        }
    }
}

async function loadChatSummaries() {
    if (!currentUser) {
        chatSummaries = [];
        renderChatList();
        return;
    }

    try {
        const data = await apiFetch('/api/chats');
        chatSummaries = Array.isArray(data.chats) ? data.chats : [];
    } catch (error) {
        console.error('Failed to load chat summaries', error);
        chatSummaries = [];
    }

    renderChatList();
}

async function loadChat(chatId) {
    if (!currentUser) return;

    try {
        const data = await apiFetch(`/api/chats/${chatId}/messages`);
        const chat = data.chat;
        currentChatId = chat.id;
        setActiveChatId(chat.id);
        assistantConversationHistory = Array.isArray(chat.messages)
            ? chat.messages.map((entry) => ({
                role: entry.role === 'assistant' ? 'assistant' : 'user',
                content: entry.content
            }))
            : [];
        if (chatTitle) chatTitle.textContent = chat.title || 'Saved Chat';
        renderConversation();
        renderChatList();
    } catch (error) {
        console.error('Failed to load chat', error);
    }
}

function updateAuthUI() {
    const signedIn = Boolean(currentUser);
    document.body.classList.toggle('signed-in', signedIn);
    document.body.classList.toggle('not-signed-in', !signedIn);

    if (userDisplay) {
        userDisplay.textContent = signedIn
            ? `Signed in as ${currentUser.name}. Your chats are saved automatically.`
            : 'Guest mode: chats are not saved';
    }

    if (profileCard) profileCard.hidden = !signedIn;
    if (profileName) profileName.textContent = signedIn ? currentUser.name : 'Signed in';
    if (authActions) authActions.hidden = signedIn;
    if (signinBtn) signinBtn.hidden = signedIn;
    if (signupBtn) signupBtn.hidden = signedIn;
    if (logoutBtn) logoutBtn.hidden = !signedIn;
}

async function bootstrapAuthState() {
    const token = getStoredToken();
    if (!token) {
        currentUser = null;
        setActiveChatId('');
        updateAuthUI();
        renderChatList();
        return;
    }

    try {
        const data = await apiFetch('/api/auth/me');
        currentUser = data.user || null;
        setStoredAuth(token, currentUser);
    } catch (error) {
        currentUser = null;
        setStoredAuth('', null);
        setActiveChatId('');
    }

    updateAuthUI();
    await loadChatSummaries();

    const activeChatId = getActiveChatId();
    if (currentUser && activeChatId && chatSummaries.some((chat) => chat.id === activeChatId)) {
        await loadChat(activeChatId);
    }
}

async function refreshHistoryAfterReply(chatIdFromServer) {
    if (!currentUser || !chatIdFromServer) return;
    currentChatId = chatIdFromServer;
    setActiveChatId(chatIdFromServer);
    await loadChatSummaries();
    if (chatTitle) {
        const currentSummary = chatSummaries.find((chat) => chat.id === currentChatId);
        chatTitle.textContent = currentSummary?.title || 'Saved Chat';
    }
}

async function sendAssistantMessage(message) {
    hideWelcomeMessage();
    appendMessageFull(message, 'user');
    assistantConversationHistory.push({ role: 'user', content: message });

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
        const historyForRequest = getRecentAssistantHistory().slice(0, -1);
        const data = await apiFetch('/api/ai-chat', {
            method: 'POST',
            body: JSON.stringify({
                message,
                history: historyForRequest,
                chatId: currentUser ? currentChatId : null
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        pendingEl.remove();

        if (data?.reply) {
            assistantConversationHistory.push({ role: 'assistant', content: data.reply });
            appendMessageFull(data.reply, 'bot');
            await refreshHistoryAfterReply(data.chatId);
        } else {
            throw new Error('No reply from AI');
        }
    } catch (err) {
        clearTimeout(timeoutId);
        console.error('assistant request failed', err);
        try { pendingEl.remove(); } catch (e) {}

        let msg = 'Sorry - the AI request failed. Please try again.';
        if (err.name === 'AbortError') {
            msg = 'The assistant took too long to respond. Please try again.';
        } else if (err.status === 429 && err.data?.retryAfter) {
            msg = `Rate limit exceeded. Please wait ${err.data.retryAfter} seconds.`;
        } else if (err.data?.error) {
            msg = err.data.error;
        }

        appendMessageFull(msg, 'bot');
    } finally {
        if (submitButton) submitButton.disabled = false;
        aiInputFull.disabled = false;
        aiInputFull.focus();
    }
}

async function handleLogout() {
    try {
        await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error('Logout request failed', error);
    }

    setStoredAuth('', null);
    setActiveChatId('');
    currentUser = null;
    chatSummaries = [];
    openChatMenuId = null;
    closeDeleteConfirm();
    resetConversation();
    updateAuthUI();
    renderChatList();
}

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

if (aiFormFull) {
    aiFormFull.addEventListener('submit', async (e) => {
        e.preventDefault();
        const value = aiInputFull.value.trim();
        if (!value) return;
        await sendAssistantMessage(value);
    });
}

if (aiInputFull) {
    aiInputFull.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            aiFormFull.dispatchEvent(new Event('submit'));
        }
    });
}

if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
        openChatMenuId = null;
        closeDeleteConfirm();
        resetConversation('New Chat');
        aiInputFull?.focus();
        closeSidebar();
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', openLogoutConfirm);
}

if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', closeDeleteConfirm);
}

if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
        if (pendingConfirmAction === 'logout') {
            closeDeleteConfirm();
            await handleLogout();
            return;
        }

        if (!pendingDeleteChat) {
            closeDeleteConfirm();
            return;
        }

        const chatToDelete = pendingDeleteChat;
        closeDeleteConfirm();
        await deleteChatById(chatToDelete.id);
    });
}

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

document.addEventListener('keydown', (e) => {
    if (!confirmOverlay?.hidden && e.key === 'Escape') {
        closeDeleteConfirm();
        return;
    }

    if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
    }
});

document.addEventListener('click', () => {
    if (!openChatMenuId) return;
    openChatMenuId = null;
    renderChatList();
});

if (confirmOverlay) {
    confirmOverlay.addEventListener('click', (event) => {
        if (event.target === confirmOverlay) {
            closeDeleteConfirm();
        }
    });
}

resetConversation();
await bootstrapAuthState();
