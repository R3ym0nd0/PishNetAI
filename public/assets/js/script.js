
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
marked.setOptions({ breaks: true });

const urlForm = document.getElementById("urlForm");
const urlInput = document.getElementById("urlInput");
const resultSection = document.getElementById("resultSection");
const resultsPanel = document.getElementById("results");
const mainNav = document.querySelector(".main-nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a, .nav-links .nav-assistant");

let aiToggle = document.getElementById('aiToggle');
const aiWidget = document.getElementById('aiWidget');
const aiClose = document.getElementById('aiClose');
const aiForm = document.getElementById('aiForm');
const aiInput = document.getElementById('aiInput');
const aiMessages = document.getElementById('aiMessages');
const aiFab = document.getElementById('aiFab');
const AI_HISTORY_LIMIT = 12;
const aiConversationHistory = [];
const authTokenKey = 'phish_ai_token';
const activeChatKey = 'phish_ai_active_chat';
let resultStatusBadge = resultSection?.querySelector('.status-badge');
let resultGrade = resultSection?.querySelector('.result-grade');
let resultSite = resultSection?.querySelector('.result-site');
let resultInfoValues = resultSection?.querySelectorAll('.result-info-value') || [];
let resultRiskValue = resultSection?.querySelector('.result-risk-value');
let resultProgressFill = resultSection?.querySelector('.result-progress-fill');
let resultIndicatorsList = resultSection?.querySelector('.result-indicators-list');
let resultPageOverviewText = resultSection?.querySelector('.result-page-overview p');
let resultSummaryText = resultSection?.querySelector('.result-summary p');
let resultRecommendationText = resultSection?.querySelector('.result-recommendation p');

// Auto-resize textarea
if (aiInput) {
    aiInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 150) + 'px';
    });

    // Enter key to send message (Shift+Enter for new line)
    aiInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            aiForm.dispatchEvent(new Event('submit', { cancelable: true }));
        }
    });
}

const NETLIFY_FRONTEND_ORIGIN = 'https://phishnetai.netlify.app';
const RENDER_API_BASE = 'https://phishnetai-fb30.onrender.com';

let previousFocus = null;
let focusTrapHandler = null;

function cacheResultElements() {
    resultStatusBadge = resultSection?.querySelector('.status-badge');
    resultGrade = resultSection?.querySelector('.result-grade');
    resultInfoValues = resultSection?.querySelectorAll('.result-info-value') || [];
    resultRiskValue = resultSection?.querySelector('.result-risk-value');
    resultProgressFill = resultSection?.querySelector('.result-progress-fill');
    resultIndicatorsList = resultSection?.querySelector('.result-indicators-list');
    resultPageOverviewText = resultSection?.querySelector('.result-page-overview p');
    resultSummaryText = resultSection?.querySelector('.result-summary p');
    resultRecommendationText = resultSection?.querySelector('.result-recommendation p');
}

function ensureResultTemplate() {
    if (!resultSection || resultSection.querySelector('.result-header')) {
        cacheResultElements();
        return;
    }

    resultSection.innerHTML = `
        <div class="result-header">
            <div class="result-title-group">
                <span class="status-badge low">Low Risk</span>
                <h3 class="result-grade">Grade: A+</h3>
            </div>
        </div>

        <div class="result-body">
            <div class="result-info-grid">
                <div class="result-info-item">
                    <svg class="result-info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    <span class="result-info-label">IP Address</span>
                    <span class="result-info-value">Unavailable</span>
                </div>
                <div class="result-info-item">
                    <svg class="result-info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    <span class="result-info-label">Report Time</span>
                    <span class="result-info-value">Unavailable</span>
                </div>
                <div class="result-info-item">
                    <svg class="result-info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                    <span class="result-info-label">TLS/SSL Status</span>
                    <span class="result-info-value">Unavailable</span>
                </div>
                <div class="result-info-item">
                    <svg class="result-info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    <span class="result-info-label">Domain Age</span>
                    <span class="result-info-value">Unavailable</span>
                </div>
            </div>

            <div class="result-risk-section">
                <div class="result-risk-header">
                    <span class="result-risk-label">Risk Score</span>
                    <span class="result-risk-value">--</span>
                </div>
                <div class="result-progress-bar">
                    <div class="result-progress-fill" style="width: 0%"></div>
                </div>
            </div>

            <div class="result-indicators">
                <div class="result-indicators-header">
                    <svg class="result-indicators-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span class="result-indicators-label">Indicators</span>
                </div>
                <ul class="result-indicators-list"></ul>
            </div>

            <div class="result-page-overview">
                <div class="result-page-overview-header">
                    <svg class="result-page-overview-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 5c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v11c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V5zm2 0v11h12V5H6zm1 14h10v2H7z"/>
                    </svg>
                    <span class="result-page-overview-label">Website Snapshot</span>
                </div>
                <p></p>
            </div>

            <div class="result-summary">
                <div class="result-summary-header">
                    <svg class="result-summary-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                    <span class="result-summary-label">Summary</span>
                </div>
                <p></p>
            </div>

            <div class="result-recommendation">
                <div class="result-recommendation-header">
                    <svg class="result-recommendation-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                    </svg>
                    <span class="result-recommendation-label">Recommendation</span>
                </div>
                <p></p>
            </div>

            <div class="result-disclaimer">
                <p>Scanner results are not 100% accurate. Verify important links before entering sensitive information.</p>
            </div>
        </div>
    `;

    cacheResultElements();
}

function showResultsPanel() {
    resultsPanel?.classList.remove('is-hidden');
}

function animateResultsReveal() {
    if (!resultsPanel || !resultSection) return;

    resultsPanel.classList.remove('result-reveal');
    resultSection.classList.remove('result-reveal-content');

    // Force reflow so the animation can restart on repeated scans.
    void resultsPanel.offsetWidth;

    resultsPanel.classList.add('result-reveal');
    resultSection.classList.add('result-reveal-content');
}

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

// === URL Scan Submission ===
if (urlForm) {
    urlForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const submittedUrl = urlInput.value.trim();
        if (!submittedUrl) {
            renderScanError('', 'Please enter a website URL before scanning.');
            resultSection?.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }

        renderLoadingState(submittedUrl);
        resultSection.scrollIntoView({ behavior: "smooth", block: "start" });

        const submitButton = urlForm.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;
        urlInput.disabled = true;

        try {
            const response = await fetch(`${getApiBase()}/api/scan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ url: submittedUrl })
            });

            const data = await readJsonResponse(response);
            if (!response.ok || !data.ok) {
                throw new Error(data.error || 'The URL could not be analyzed.');
            }

            renderScanResult(data);
        } catch (error) {
            console.error('Scan request failed', error);
            renderScanError(submittedUrl, error.message || 'The URL could not be analyzed.');
        } finally {
            if (submitButton) submitButton.disabled = false;
            urlInput.disabled = false;
        }
    });
}

function getRecentConversationHistory() {
    return aiConversationHistory.slice(-AI_HISTORY_LIMIT);
}

function getStoredToken() {
    return localStorage.getItem(authTokenKey) || '';
}

function getActiveChatId() {
    return localStorage.getItem(activeChatKey) || '';
}

function setActiveChatId(chatId) {
    if (chatId) {
        localStorage.setItem(activeChatKey, chatId);
        return;
    }

    localStorage.removeItem(activeChatKey);
}

async function loadActiveChatForWidget() {
    const token = getStoredToken();
    const chatId = getActiveChatId();

    if (!token || !chatId) {
        return false;
    }

    try {
        const response = await fetch(`${getApiBase()}/api/chats/${chatId}/messages`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        const data = await readJsonResponse(response);
        if (!response.ok || !data.chat) {
            throw new Error(data.error || 'Could not load saved chat.');
        }

        aiConversationHistory.length = 0;
        (data.chat.messages || []).forEach((entry) => {
            aiConversationHistory.push({
                role: entry.role === 'assistant' ? 'assistant' : 'user',
                content: entry.content
            });
        });

        renderWidgetConversation();
        return true;
    } catch (error) {
        console.error('Failed to load widget chat history', error);
        return false;
    }
}

function renderWidgetConversation() {
    if (!aiMessages) return;
    aiMessages.innerHTML = '';

    if (!aiConversationHistory.length) {
        showAiWelcome();
        return;
    }

    aiConversationHistory.forEach((entry) => {
        appendMessage(entry.content, entry.role === 'assistant' ? 'bot' : 'user');
    });
}

async function loadHistoryToWidget() {
    const restored = await loadActiveChatForWidget();
    if (!restored) {
        renderWidgetConversation();
    }
}

function showAiWelcome() {
    const existing = document.getElementById('aiWelcome');
    if (existing) existing.remove();
    const welcome = document.createElement('div');
    welcome.className = 'ai-welcome';
    welcome.id = 'aiWelcome';
    welcome.innerHTML = `
        <img src="assets/images/logo.png" alt="PhishNet AI logo" class="ai-welcome-logo">
        <h3>How can I help you today?</h3>
        <p>I'm Phinny, your phishing-focused assistant. Paste a suspicious URL, message, or ask what to do next.</p>
    `;
    aiMessages.appendChild(welcome);
}

function hideAiWelcome() {
    const welcome = document.getElementById('aiWelcome');
    if (welcome) welcome.remove();
}

function appendMessage(text, who = 'bot') {
    hideAiWelcome();
    const el = document.createElement('div');
    el.className = `ai-msg ${who}`;
    el.innerHTML = marked.parse(text);
    aiMessages.appendChild(el);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

function getApiBase() {
    const { origin, hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return origin;
    if (origin === NETLIFY_FRONTEND_ORIGIN) return RENDER_API_BASE;
    return origin;
}

function getGradeFromRiskScore(riskScore) {
    if (riskScore <= 5) return 'A+';
    if (riskScore <= 10) return 'A';
    if (riskScore <= 20) return 'B+';
    if (riskScore <= 30) return 'B';
    if (riskScore <= 40) return 'C+';
    if (riskScore <= 55) return 'C';
    if (riskScore <= 70) return 'D+';
    if (riskScore <= 85) return 'D';
    return 'F';
}

function getStatusClass(prediction, riskScore) {
    if (prediction === 'Phishing' || riskScore > 60) return 'high';
    if (riskScore > 25) return 'medium';
    return 'low';
}

function formatTimestamp(date = new Date()) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    }).format(date);
}

function setStatusBadge(text, statusClass) {
    if (!resultStatusBadge) return;
    resultStatusBadge.textContent = text;
    resultStatusBadge.classList.remove('low', 'medium', 'high');
    if (statusClass) resultStatusBadge.classList.add(statusClass);
}

function updateIndicators(indicators = []) {
    if (!resultIndicatorsList) return;
    const indicatorsCard = resultIndicatorsList.closest('.result-indicators');
    resultIndicatorsList.innerHTML = '';
    resultIndicatorsList.classList.remove('collapsed');
    indicatorsCard?.classList.remove('expanded');
    indicatorsCard?.classList.remove('desktop-scroll');

    const existingToggle = resultSection?.querySelector('.result-indicators-toggle');
    if (existingToggle) existingToggle.remove();

    indicators.forEach((indicator) => {
        const item = document.createElement('li');
        item.textContent = indicator;
        resultIndicatorsList.appendChild(item);
    });

    const collapseThreshold = 4;
    if (indicators.length <= collapseThreshold) return;

    resultIndicatorsList.classList.add('collapsed');

    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'result-indicators-toggle';
    toggleButton.textContent = `Read more (${indicators.length - collapseThreshold} more)`;
    toggleButton.setAttribute('aria-expanded', 'false');

    toggleButton.addEventListener('click', () => {
        const expanded = toggleButton.getAttribute('aria-expanded') === 'true';
        resultIndicatorsList.classList.toggle('collapsed', expanded);
        indicatorsCard?.classList.toggle('expanded', !expanded);
        toggleButton.setAttribute('aria-expanded', String(!expanded));
        toggleButton.textContent = expanded
            ? `Read more (${indicators.length - collapseThreshold} more)`
            : 'Show less';
    });

    resultIndicatorsList.insertAdjacentElement('afterend', toggleButton);
}

async function readJsonResponse(response) {
    const text = await response.text();

    try {
        return text ? JSON.parse(text) : {};
    } catch (error) {
        return {
            ok: false,
            error: text || 'The server returned an unexpected response.'
        };
    }
}

// This updates the existing result card while keeping the current UI structure intact.
function renderScanResult(data) {
    ensureResultTemplate();
    showResultsPanel();
    animateResultsReveal();
    const riskScore = Number(data.riskScore) || 0;
    const grade = data.grade || getGradeFromRiskScore(riskScore);
    const statusClass = data.riskClass || getStatusClass(data.prediction, riskScore);
    const statusLabel = data.prediction === 'Phishing' ? 'High Risk' : (data.riskLevel || 'Low Risk');
    const featureData = data.features || {};

    setStatusBadge(statusLabel, statusClass);

    if (resultGrade) resultGrade.textContent = `Grade: ${grade}`;
    if (resultInfoValues[0]) resultInfoValues[0].textContent = featureData.ipAddress || 'Unavailable';
    if (resultInfoValues[1]) resultInfoValues[1].textContent = formatTimestamp();
    if (resultInfoValues[2]) resultInfoValues[2].textContent = featureData.sslStatus || 'Unavailable';
    if (resultInfoValues[3]) resultInfoValues[3].textContent = featureData.domainAge || 'Not available';
    if (resultRiskValue) resultRiskValue.textContent = `${riskScore}%`;
    if (resultProgressFill) resultProgressFill.style.width = `${riskScore}%`;

    updateIndicators(data.indicators || []);

    if (resultPageOverviewText) {
        resultPageOverviewText.textContent = data.pageOverview || 'A short website overview was not available for this scan.';
    }

    if (resultSummaryText) {
        resultSummaryText.textContent = data.summary || 'The scan completed, but no summary was returned.';
    }

    if (resultRecommendationText) {
        resultRecommendationText.textContent = data.recommendation || 'Review the URL carefully before continuing.';
    }

}

function renderLoadingState(submittedUrl) {
    showResultsPanel();
    animateResultsReveal();
    if (!resultSection) return;

    resultSection.innerHTML = `
        <div class="result-loading" aria-live="polite">
            <span class="result-loading-badge">Scanning in progress</span>
            <h3 class="result-loading-title">Analyzing your link now</h3>
            <p class="result-loading-text">PhishNet AI is checking phishing signals, page structure, trust indicators, and AI risk prediction.</p>
            <div class="result-loading-bar" aria-hidden="true">
                <span class="result-loading-bar-fill"></span>
            </div>
            <div class="result-loading-steps">
                <div class="result-loading-step">Fetching website data</div>
                <div class="result-loading-step">Extracting phishing features</div>
                <div class="result-loading-step">Preparing the final scan result</div>
            </div>
        </div>
    `;

    cacheResultElements();
}

function renderScanError(submittedUrl, errorMessage) {
    ensureResultTemplate();
    showResultsPanel();
    animateResultsReveal();
    const normalizedError = String(errorMessage || '');
    const isForbiddenError = normalizedError.includes('status 403') || normalizedError.toLowerCase().includes('forbidden');

    setStatusBadge(isForbiddenError ? '403 Forbidden' : 'Scan Error', 'high');
    if (resultGrade) resultGrade.textContent = isForbiddenError ? 'Grade: Blocked' : 'Grade: Unavailable';

    resultInfoValues.forEach((node, index) => {
        const defaults = ['Unavailable', formatTimestamp(), 'Unavailable', 'Unavailable'];
        if (node) node.textContent = defaults[index] || 'Unavailable';
    });

    if (resultRiskValue) resultRiskValue.textContent = 'N/A';
    if (resultProgressFill) resultProgressFill.style.width = '100%';

    updateIndicators(
        isForbiddenError
            ? [
                'The website blocked the scan request with a 403 Forbidden response.',
                'Some sites prevent automated requests or scraping from external scanners.'
            ]
            : [
                'The scanner could not complete the analysis.',
                'This may be caused by an invalid URL, website timeout, or backend service issue.'
            ]
    );

    if (resultPageOverviewText) {
        resultPageOverviewText.textContent = isForbiddenError
            ? 'A website snapshot could not be generated because the target site blocked access to the scan request.'
            : 'A website snapshot could not be generated because the scan did not complete.';
    }

    if (resultSummaryText) {
        resultSummaryText.textContent = errorMessage || 'The URL could not be analyzed.';
    }

    if (resultRecommendationText) {
        resultRecommendationText.textContent = isForbiddenError
            ? 'The site may be protected against automated access. Try another URL or review the domain manually before trusting it.'
            : 'Check the URL format, then try again. If the problem continues, verify that the backend and Python AI service are both running.';
    }

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
        aiConversationHistory.push({ role: 'user', content: v });
        aiInput.value = '';

        const submitBtn = aiForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        aiInput.disabled = true;

        const pendingEl = document.createElement('div');
        pendingEl.className = 'ai-msg bot pending';
        pendingEl.textContent = 'Thinking';
        aiMessages.appendChild(pendingEl);
        aiMessages.scrollTop = aiMessages.scrollHeight;

        const controller = new AbortController();
        const timeoutMs = 30000;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const historyForRequest = getRecentConversationHistory().slice(0, -1);
            const token = getStoredToken();
            const chatId = token ? getActiveChatId() : '';
            const resp = await fetch(`${getApiBase()}/api/ai-chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    message: v,
                    history: historyForRequest,
                    ...(chatId ? { chatId } : {})
                }),
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
                const reply = data.reply || 'AI replied, but no text.';
                if (token && data.chatId) {
                    setActiveChatId(data.chatId);
                }
                aiConversationHistory.push({ role: 'assistant', content: reply });
                appendMessage(reply, 'bot');
            } else {
                throw new Error(data?.error || 'No reply from AI');
            }
        } catch (err) {
            clearTimeout(timeoutId);
            console.error('AI request failed', err);
            pendingEl.remove();
            appendMessage('The AI request failed. Please try again.', 'bot');
        } finally {
            if (!aiCooldown) {
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
