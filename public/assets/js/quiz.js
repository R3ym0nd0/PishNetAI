const authTokenKey = 'phish_ai_token';
const authUserKey = 'phish_ai_user';
const activeChatKey = 'phish_ai_active_chat';
const DEPLOY_FRONTEND_ORIGINS = new Set([
    'https://phishnetai.netlify.app',
    'https://pishnetai.vercel.app'
]);
const RENDER_API_BASE = 'https://phishnetai-fb30.onrender.com';
const coreQuizIds = ['url-basics', 'message-red-flags', 'after-clicking'];
const advancedQuizRules = {
    'phishing-scenarios': {
        requiresQuizIds: ['url-basics', 'message-red-flags', 'after-clicking'],
        label: 'Unlocks after you complete all 3 core quiz sets.'
    },
    'best-practices': {
        requiresQuizIds: ['phishing-scenarios'],
        minimumAttempts: 4,
        minimumAverageScore: 70,
        label: 'Unlocks after Phishing Scenarios plus 4 saved attempts and a 70% average.'
    }
};

const quizzes = {
    'url-basics': {
        title: 'URL Basics',
        description: 'Practice checking links and recognizing URL patterns that are often used in phishing attempts.',
        questions: [
            {
                topic: 'Link inspection',
                prompt: 'You receive a message asking you to verify your school account through `lcc-campus-login-support.com`. What is the best first reaction?',
                options: [
                    'Open it immediately because it mentions the school name.',
                    'Check the full domain first before trusting the link.',
                    'Reply with your password instead of clicking.',
                    'Ignore the spelling because support pages use many subdomains.'
                ],
                answer: 1,
                explanation: 'A suspicious domain name is a common phishing sign. Always inspect the exact website name before trusting the page.'
            },
            {
                topic: 'Shortened URLs',
                prompt: 'A classmate sends a shortened URL and says it leads to a scholarship form. What is the safest move?',
                options: [
                    'Open it right away if the message sounds urgent.',
                    'Ask where it leads or preview the destination first.',
                    'Share it with more classmates before checking.',
                    'Trust it because shortened links are normal.'
                ],
                answer: 1,
                explanation: 'Shortened links hide the real destination. It is safer to preview or verify them before opening.'
            },
            {
                topic: 'Secure domains',
                prompt: 'A page uses HTTPS but the website name looks slightly misspelled. What should you do?',
                options: [
                    'Trust it because HTTPS always means safe.',
                    'Continue only if the logo looks official.',
                    'Treat it with caution because HTTPS alone is not enough.',
                    'Enter your account details to test if it is real.'
                ],
                answer: 2,
                explanation: 'HTTPS only means the connection is encrypted. A fake website can still use HTTPS and steal information.'
            },
            {
                topic: 'URL structure',
                prompt: 'Which link is more suspicious for a login page?',
                options: [
                    'https://accounts.lcc.edu/login',
                    'https://lcc.edu.verify-user-access.net/login',
                    'https://portal.lcc.edu/student',
                    'https://lcc.edu/helpdesk'
                ],
                answer: 1,
                explanation: 'The real domain is at the end. In that suspicious link, `verify-user-access.net` is the actual website, not `lcc.edu`.'
            }
        ]
    },
    'message-red-flags': {
        title: 'Message Red Flags',
        description: 'Learn how to notice warning signs in emails, texts, and chat messages before they put your account or information at risk.',
        questions: [
            {
                topic: 'Urgency',
                prompt: 'A message says your account will be suspended in 10 minutes unless you click a link. What warning sign stands out most?',
                options: [
                    'The short deadline meant to pressure you.',
                    'The message arrived during the day.',
                    'The sender used complete sentences.',
                    'The message mentioned your account.'
                ],
                answer: 0,
                explanation: 'Phishing messages often create panic so people react without checking the details first.'
            },
            {
                topic: 'Sender check',
                prompt: 'An email claims to be from the registrar but the sender address ends in a free email domain. What should you do?',
                options: [
                    'Trust it if the signature block looks formal.',
                    'Reply and ask for more details.',
                    'Verify through an official school contact instead.',
                    'Click the attachment to confirm the request.'
                ],
                answer: 2,
                explanation: 'If the sender address does not match the official source, verify through a trusted contact before responding.'
            },
            {
                topic: 'Requests for secrets',
                prompt: 'Which message is most suspicious?',
                options: [
                    "A teacher reminding you about tomorrow's class.",
                    'A campus office asking you to confirm your password by email.',
                    'A classmate sending project updates.',
                    'A school department posting office hours.'
                ],
                answer: 1,
                explanation: 'Legitimate organizations should not ask for passwords through email or chat.'
            },
            {
                topic: 'Attachments',
                prompt: 'You get an unexpected attachment labeled "account-update-form." What is the safest next step?',
                options: [
                    'Open it if the file name looks official.',
                    'Forward it to friends to ask what they think.',
                    'Verify the request first through an official channel.',
                    'Download it but do not open it yet.'
                ],
                answer: 2,
                explanation: 'Unexpected files can carry malware or phishing forms. Verify first before opening anything.'
            }
        ]
    },
    'after-clicking': {
        title: 'After Clicking: What to Do?',
        description: 'Review the right steps to take after clicking a suspicious link or sharing personal details on an unsafe page.',
        questions: [
            {
                topic: 'Immediate action',
                prompt: 'You clicked a suspicious link but did not enter any information. What should you do first?',
                options: [
                    'Ignore it because nothing was submitted.',
                    'Close the page and monitor for unusual activity.',
                    'Share the link with others to confirm.',
                    'Log out of all your accounts immediately without checking anything else.'
                ],
                answer: 1,
                explanation: 'Closing the page and watching for anything unusual is a practical first response when no information was entered.'
            },
            {
                topic: 'Password response',
                prompt: 'You accidentally entered your password on a suspicious page. What is the best next step?',
                options: [
                    'Wait to see if anything happens.',
                    'Change your password right away on the real site.',
                    'Send another email to the attacker asking them to delete it.',
                    'Reuse the same password on another account to test it.'
                ],
                answer: 1,
                explanation: 'If a password may be exposed, change it immediately on the official website.'
            },
            {
                topic: 'Reporting',
                prompt: 'After receiving a phishing message that targets students, what is the most helpful thing to do?',
                options: [
                    'Delete it quietly and tell nobody.',
                    'Report it through the proper school or platform channel.',
                    'Reply angrily to the sender.',
                    'Post the full malicious link publicly without warning.'
                ],
                answer: 1,
                explanation: 'Reporting helps protect others and allows the incident to be reviewed through proper channels.'
            },
            {
                topic: 'Device safety',
                prompt: 'You downloaded a suspicious file from a fake page. What is the safest response?',
                options: [
                    'Keep using the device and hope nothing happens.',
                    'Run a security check and avoid opening the file again.',
                    'Rename the file so it becomes safe.',
                    'Move the file into another folder and ignore it.'
                ],
                answer: 1,
                explanation: 'A suspicious download should be treated carefully. Run a security check and avoid reopening the file.'
            }
        ]
    },
    'phishing-scenarios': {
        title: 'Phishing Scenarios',
        description: 'Go through realistic situations that test how well you can identify and respond to possible phishing attempts.',
        questions: [
            {
                topic: 'Campus scenario',
                prompt: 'A student receives a "tuition balance" email with a payment link and urgent warning. What is the safest reaction?',
                options: [
                    'Pay immediately to avoid penalties.',
                    'Verify the balance through the official school portal first.',
                    'Forward the message to a friend and let them decide.',
                    'Reply with your full student information.'
                ],
                answer: 1,
                explanation: 'Payment-related urgency is a common phishing tactic. Verify through the official portal before taking action.'
            },
            {
                topic: 'Social media',
                prompt: 'A page using your school logo asks you to log in again because your session expired. What should you check first?',
                options: [
                    'Whether the logo looks real.',
                    'Whether the browser window is large enough.',
                    'Whether the website address is the real official domain.',
                    'Whether the button color matches the school branding.'
                ],
                answer: 2,
                explanation: 'Visual design can be copied easily. The actual domain is a far better trust check.'
            },
            {
                topic: 'QR code scam',
                prompt: 'You scan a QR code posted on campus that opens a login form asking for your account details. What should you do?',
                options: [
                    'Enter the details if the page loads quickly.',
                    'Treat it carefully and verify the destination first.',
                    'Trust it because it came from a QR code.',
                    'Use the same password to see if the form works.'
                ],
                answer: 1,
                explanation: 'QR codes can hide suspicious destinations the same way shortened links can.'
            },
            {
                topic: 'Impersonation',
                prompt: 'A chat message from a "school officer" asks for a one-time code sent to your phone. What is the safest response?',
                options: [
                    'Share it because the request sounds official.',
                    'Do not share the code and verify the request independently.',
                    'Send half of the code first.',
                    'Post the code in the group chat for confirmation.'
                ],
                answer: 1,
                explanation: 'One-time codes should never be shared casually. Attackers often use impersonation to steal them.'
            }
        ]
    },
    'best-practices': {
        title: 'Best Practices',
        description: 'Strengthen your everyday safety habits with practical best practices for accounts, messages, and suspicious websites.',
        questions: [
            {
                topic: 'Password habits',
                prompt: 'Which habit best reduces the impact of phishing on your accounts?',
                options: [
                    'Using the same strong password everywhere.',
                    'Using different passwords for important accounts.',
                    'Saving passwords in random chat threads.',
                    'Sharing passwords only with close friends.'
                ],
                answer: 1,
                explanation: 'Different passwords reduce the damage if one account is exposed through phishing.'
            },
            {
                topic: 'Verification',
                prompt: 'When a message asks you to act on an account issue, what is the best practice?',
                options: [
                    'Use the link in the message to fix it immediately.',
                    'Log in through the official website or app instead.',
                    'Wait for three more messages before checking.',
                    'Ask strangers online if the message looks real.'
                ],
                answer: 1,
                explanation: 'Going directly to the official site is safer than trusting links from messages.'
            },
            {
                topic: 'Sharing links',
                prompt: 'A friend asks if a suspicious link is safe. What is the best response?',
                options: [
                    'Tell them to open it and find out.',
                    'Warn them not to open it until it is verified.',
                    'Post it in a group chat for reactions.',
                    'Say it is safe because it has HTTPS.'
                ],
                answer: 1,
                explanation: 'It is safer to pause and verify suspicious links before anyone interacts with them.'
            },
            {
                topic: 'Awareness habit',
                prompt: 'Which daily habit helps improve phishing awareness the most?',
                options: [
                    'Reading only the subject line of messages.',
                    'Checking links, sender details, and requests before acting.',
                    'Opening all attachments quickly so they do not pile up.',
                    'Trusting messages from familiar names automatically.'
                ],
                answer: 1,
                explanation: 'Consistently checking details before acting builds strong phishing awareness over time.'
            }
        ]
    }
};

const quizStartButtons = document.querySelectorAll('.quiz-start-btn[data-quiz]');
const quizHeroPanel = document.querySelector('.quiz-hero-panel');
const quizSidebar = document.getElementById('quizSidebar');
const quizSidebarOverlay = document.getElementById('quizSidebarOverlay');
const quizSidebarToggle = document.getElementById('quizSidebarToggle');
const quizSidebarBackBtn = document.querySelector('.quiz-sidebar-back-btn');
const quizSidebarStartBtn = document.getElementById('quizSidebarStartBtn');
const quizSidebarLogoutBtn = document.getElementById('quizSidebarLogoutBtn');
const quizSidebarProfileBtn = document.getElementById('quizSidebarProfileBtn');
const quizSidebarName = document.getElementById('quizSidebarName');
const quizSidebarEmail = document.getElementById('quizSidebarEmail');
const quizSidebarNavLinks = [...document.querySelectorAll('[data-quiz-nav-link]')];
const quizMobileTopbar = document.getElementById('quizMobileTopbar');
const quizMobileTopbarLabel = document.getElementById('quizMobileTopbarLabel');
const quizHookPanel = document.getElementById('quizHookPanel');
const quizHeroEyebrow = document.getElementById('quizHeroEyebrow');
const quizHeroTitle = document.getElementById('quizHeroTitle');
const quizHeroDescription = document.getElementById('quizHeroDescription');
const quizHeroPrimaryAction = document.getElementById('quizHeroPrimaryAction');
const quizHeroSecondaryAction = document.getElementById('quizHeroSecondaryAction');
const quizHeroStatValue1 = document.getElementById('quizHeroStatValue1');
const quizHeroStatLabel1 = document.getElementById('quizHeroStatLabel1');
const quizHeroStatValue2 = document.getElementById('quizHeroStatValue2');
const quizHeroStatLabel2 = document.getElementById('quizHeroStatLabel2');
const quizHeroStatValue3 = document.getElementById('quizHeroStatValue3');
const quizHeroStatLabel3 = document.getElementById('quizHeroStatLabel3');
const quizProfilePanel = document.getElementById('quizProfilePanel');
const quizLogoutConfirmOverlay = document.getElementById('quizLogoutConfirmOverlay');
const quizLogoutCancelBtn = document.getElementById('quizLogoutCancelBtn');
const quizLogoutConfirmBtn = document.getElementById('quizLogoutConfirmBtn');
const quizProfileName = document.getElementById('quizProfileName');
const quizProfileEmail = document.getElementById('quizProfileEmail');
const quizProfileAttempts = document.getElementById('quizProfileAttempts');
const quizProfileAverage = document.getElementById('quizProfileAverage');
const quizProfileBest = document.getElementById('quizProfileBest');
const quizProfileBadgeCount = document.getElementById('quizProfileBadgeCount');
const quizProfileBadgeList = document.getElementById('quizProfileBadgeList');
const quizProfileBadgeEmpty = document.getElementById('quizProfileBadgeEmpty');
const quizProfileProgressBadge = document.getElementById('quizProfileProgressBadge');
const quizProfileProgressList = document.getElementById('quizProfileProgressList');
const quizProfileProgressEmpty = document.getElementById('quizProfileProgressEmpty');
const quizHistoryPanelSection = document.getElementById('quizHistoryPanel');
const quizHistoryReviewBadge = document.getElementById('quizHistoryReviewBadge');
const quizHistoryReviewList = document.getElementById('quizHistoryReviewList');
const quizHistoryReviewEmpty = document.getElementById('quizHistoryReviewEmpty');
const quizHistoryOtherBadge = document.getElementById('quizHistoryOtherBadge');
const quizHistoryOtherList = document.getElementById('quizHistoryOtherList');
const quizHistoryOtherEmpty = document.getElementById('quizHistoryOtherEmpty');
const quizHistoryArchiveAttempts = document.getElementById('quizHistoryArchiveAttempts');
const quizHistoryArchiveBest = document.getElementById('quizHistoryArchiveBest');
const quizHistoryArchiveReview = document.getElementById('quizHistoryArchiveReview');
const quizLeaderboardPanel = document.getElementById('quizLeaderboardPanel');
const quizLeaderboardList = document.getElementById('quizLeaderboardList');
const quizLeaderboardEmpty = document.getElementById('quizLeaderboardEmpty');
const guestLeaderboardPreview = document.getElementById('guestLeaderboardPreview');
const quizPublicProfileOverlay = document.getElementById('quizPublicProfileOverlay');
const quizPublicProfileClose = document.getElementById('quizPublicProfileClose');
const quizPublicProfileBody = document.getElementById('quizPublicProfileBody');
const quizAttemptReviewOverlay = document.getElementById('quizAttemptReviewOverlay');
const quizAttemptReviewClose = document.getElementById('quizAttemptReviewClose');
const quizAttemptReviewBody = document.getElementById('quizAttemptReviewBody');
const quizSectionTitle = document.getElementById('quizSectionTitle');
const quizSectionDescription = document.getElementById('quizSectionDescription');
const quizPagination = document.getElementById('quizPagination');
const quizzesSection = document.getElementById('quizzes');
const quizWorkspace = document.getElementById('quizWorkspace');
const quizSessionTitle = document.getElementById('quizSessionTitle');
const quizSessionDesc = document.getElementById('quizSessionDesc');
const quizQuestionCounter = document.getElementById('quizQuestionCounter');
const quizProgressFill = document.getElementById('quizProgressFill');
const quizQuestionTopic = document.getElementById('quizQuestionTopic');
const quizQuestionText = document.getElementById('quizQuestionText');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const quizNextBtn = document.getElementById('quizNextBtn');
const quizQuestionCard = document.getElementById('quizQuestionCard');
const quizResultCard = document.getElementById('quizResultCard');
const quizResultScore = document.getElementById('quizResultScore');
const quizResultTitle = document.getElementById('quizResultTitle');
const quizResultSummary = document.getElementById('quizResultSummary');
const quizCorrectCount = document.getElementById('quizCorrectCount');
const quizResultQuizName = document.getElementById('quizResultQuizName');
const guestQuizPrompt = document.getElementById('guestQuizPrompt');
const quizRetryBtn = document.getElementById('quizRetryBtn');
const quizChooseAnotherBtn = document.getElementById('quizChooseAnotherBtn');
const quizExitBtn = document.getElementById('quizExitBtn');
const quizGrid = document.querySelector('.quiz-grid');
const quizCards = [...document.querySelectorAll('.quiz-card[data-quiz-card]')];

let currentQuizId = null;
let currentQuestionIndex = 0;
let selectedAnswerIndex = null;
let score = 0;
let answers = [];
let signedInQuizAttempts = [];
let currentQuizPage = 1;
const quizCardsPerPage = 6;
const totalQuizPages = 10;

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

if (quizHeroPanel) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            quizHeroPanel.classList.add('is-animated');
        }, 80);
    });
}

createPlaceholderQuizCards();
updateQuizCardTierLabels();
renderQuizPagination();
applyQuizPageState();

function getStoredAuthToken() {
    return localStorage.getItem(authTokenKey) || sessionStorage.getItem(authTokenKey) || '';
}

function getApiBase() {
    const { origin, hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return origin;
    if (DEPLOY_FRONTEND_ORIGINS.has(origin)) return RENDER_API_BASE;
    return origin;
}

async function apiFetch(endpoint, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = getStoredAuthToken();

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    if (options.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${getApiBase()}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.ok === false) {
        throw new Error(data?.error || 'Request failed.');
    }

    return data;
}

function getStoredUser() {
    const rawUser = localStorage.getItem(authUserKey) || sessionStorage.getItem(authUserKey);
    if (!rawUser) return null;

    try {
        return JSON.parse(rawUser);
    } catch {
        return { name: rawUser };
    }
}

function isLoggedIn() {
    return Boolean(getStoredAuthToken());
}

function clearStoredAuth() {
    [localStorage, sessionStorage].forEach((storage) => {
        storage.removeItem(authTokenKey);
        storage.removeItem(authUserKey);
        storage.removeItem(activeChatKey);
    });
}

async function handleQuizLogout() {
    try {
        await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error('Quiz logout request failed', error);
    }

    clearStoredAuth();
    closePublicQuizProfile();
    resetQuizWorkspace();
    applyQuizPageState();
    window.location.href = 'quiz.html';
}

function openQuizLogoutConfirm() {
    if (quizLogoutConfirmOverlay) {
        quizLogoutConfirmOverlay.hidden = false;
    }
    quizLogoutConfirmBtn?.focus();
}

function closeQuizLogoutConfirm() {
    if (quizLogoutConfirmOverlay) {
        quizLogoutConfirmOverlay.hidden = true;
    }
}

function getQuizUnlockState(quizId, attempts = []) {
    const rule = advancedQuizRules[quizId];
    if (!rule) {
        return {
            locked: false,
            reason: '',
            cta: 'Start Quiz'
        };
    }

    if (!isLoggedIn()) {
        return {
            locked: true,
            reason: 'Sign in to start advanced quiz sets and save your progress.',
            cta: 'Sign In to Unlock',
            action: 'login'
        };
    }

    const attemptsCount = attempts.length;
    const uniqueTopics = new Set(attempts.map((attempt) => attempt.quizId)).size;
    const averageScore = attemptsCount
        ? Math.round(attempts.reduce((total, attempt) => total + Number(attempt.percentage || 0), 0) / attemptsCount)
        : 0;
    const completedQuizIds = new Set(attempts.map((attempt) => attempt.quizId));
    const requiredQuizIds = Array.isArray(rule.requiresQuizIds) ? rule.requiresQuizIds : [];
    const missingQuizTitles = requiredQuizIds
        .filter((requiredQuizId) => !completedQuizIds.has(requiredQuizId))
        .map((requiredQuizId) => quizzes[requiredQuizId]?.title || requiredQuizId);
    const hasRequiredQuizIds = requiredQuizIds.every((requiredQuizId) => completedQuizIds.has(requiredQuizId));

    const unlocked =
        hasRequiredQuizIds &&
        attemptsCount >= (rule.minimumAttempts || 0) &&
        uniqueTopics >= (rule.minimumUniqueTopics || 0) &&
        averageScore >= (rule.minimumAverageScore || 0);

    let reason = '';
    if (!unlocked) {
        if (missingQuizTitles.length) {
            reason = `Complete ${missingQuizTitles.join(', ')} first.`;
        } else if (attemptsCount < (rule.minimumAttempts || 0)) {
            reason = `Save ${rule.minimumAttempts} quiz attempts to unlock this set.`;
        } else if (uniqueTopics < (rule.minimumUniqueTopics || 0)) {
            reason = `Complete ${rule.minimumUniqueTopics} different quiz sets first.`;
        } else if (averageScore < (rule.minimumAverageScore || 0)) {
            reason = `Reach at least a ${rule.minimumAverageScore}% average score to unlock this set.`;
        } else {
            reason = rule.label;
        }
    }

    return {
        locked: !unlocked,
        reason,
        cta: unlocked ? 'Start Quiz' : 'Locked for Now',
        action: unlocked ? 'start' : 'locked'
    };
}

function updateQuizUnlockStates(attempts = []) {
    quizStartButtons.forEach((button) => {
        const quizId = button.dataset.quiz;
        const card = button.closest('[data-quiz-card]');
        const note = document.getElementById(`quizUnlockNote-${quizId}`);
        const state = getQuizUnlockState(quizId, attempts);

        button.dataset.lockedAction = state.action || 'start';
        button.textContent = state.cta;
        button.disabled = state.locked && state.action !== 'login';

        if (card) {
            card.classList.toggle('is-locked', state.locked);
        }

        if (note) {
            note.hidden = !state.locked;
            note.textContent = state.reason;
        }
    });
}

function getRecommendedQuizId(attempts = []) {
    const completedQuizIds = new Set(attempts.map((attempt) => attempt.quizId));

    for (const quizId of coreQuizIds) {
        if (!completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    if (!getQuizUnlockState('phishing-scenarios', attempts).locked && !completedQuizIds.has('phishing-scenarios')) {
        return 'phishing-scenarios';
    }

    if (!getQuizUnlockState('best-practices', attempts).locked && !completedQuizIds.has('best-practices')) {
        return 'best-practices';
    }

    const summaryByQuizId = new Map();
    attempts.forEach((attempt) => {
        const existing = summaryByQuizId.get(attempt.quizId) || {
            quizId: attempt.quizId,
            bestScore: -1,
            latestAttemptAt: ''
        };

        existing.bestScore = Math.max(existing.bestScore, Number(attempt.percentage || 0));
        existing.latestAttemptAt = existing.latestAttemptAt > attempt.createdAt
            ? existing.latestAttemptAt
            : attempt.createdAt;

        summaryByQuizId.set(attempt.quizId, existing);
    });

    const fallbackOrder = [...coreQuizIds, 'phishing-scenarios', 'best-practices'];
    const reviewCandidate = [...summaryByQuizId.values()]
        .sort((left, right) => {
            if (left.bestScore !== right.bestScore) return left.bestScore - right.bestScore;
            if (left.latestAttemptAt !== right.latestAttemptAt) return left.latestAttemptAt.localeCompare(right.latestAttemptAt);
            return fallbackOrder.indexOf(left.quizId) - fallbackOrder.indexOf(right.quizId);
        })[0];

    return reviewCandidate?.quizId || coreQuizIds[0];
}

function updateQuizCardTierLabels() {
    const tierMap = {
        'url-basics': { badge: 'Core Series', difficulty: 'Beginner' },
        'message-red-flags': { badge: 'Core Series', difficulty: 'Intermediate' },
        'after-clicking': { badge: 'Core Series', difficulty: 'Beginner' },
        'phishing-scenarios': { badge: 'Advanced Series', difficulty: 'Advanced' },
        'best-practices': { badge: 'Mastery Series', difficulty: 'Intermediate' }
    };

    Object.entries(tierMap).forEach(([quizId, config]) => {
        const card = document.querySelector(`[data-quiz-card="${quizId}"]`);
        if (!card) return;

        const badge = card.querySelector('.quiz-badge');
        const difficulty = card.querySelector('.difficulty');

        if (badge) {
            badge.textContent = config.badge;
        }

        if (difficulty) {
            difficulty.textContent = config.difficulty;
        }
    });
}

function setActiveQuizSidebarLink(targetId = '') {
    quizSidebarNavLinks.forEach((link) => {
        const href = link.getAttribute('href') || '';
        const isActive = href === `#${targetId}`;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function shouldUseQuizSidebarDrawer() {
    return window.innerWidth <= 1024;
}

function syncQuizSidebarToggleState(isOpen) {
    if (quizSidebarToggle) {
        quizSidebarToggle.setAttribute('aria-expanded', String(isOpen));
    }
}

function closeQuizSidebarDrawer() {
    document.body.classList.remove('quiz-sidebar-open');
    syncQuizSidebarToggleState(false);
}

function openQuizSidebarDrawer() {
    if (!isLoggedIn() || !shouldUseQuizSidebarDrawer()) return;
    document.body.classList.add('quiz-sidebar-open');
    syncQuizSidebarToggleState(true);
}

function toggleQuizSidebarDrawer() {
    if (document.body.classList.contains('quiz-sidebar-open')) {
        closeQuizSidebarDrawer();
        return;
    }

    openQuizSidebarDrawer();
}

function setSignedInQuizView(view = 'quiz-library') {
    if (!isLoggedIn()) return;

    const quizLibraryOnly = view === 'quiz-library';
    const leaderboardOnly = view === 'leaderboard';
    const profileOnly = view === 'profile';
    const historyOnly = view === 'history';
    const currentQuizOnly = view === 'current-quiz';

    if (quizProfilePanel) quizProfilePanel.hidden = !profileOnly;
    if (quizHistoryPanelSection) quizHistoryPanelSection.hidden = !historyOnly;
    if (quizLeaderboardPanel) quizLeaderboardPanel.hidden = !leaderboardOnly;
    if (quizzesSection) quizzesSection.hidden = !quizLibraryOnly;
    if (quizWorkspace) quizWorkspace.hidden = !currentQuizOnly || !currentQuizId;
}

function scrollToQuizSection(targetId, behavior = 'smooth') {
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;

    if (isLoggedIn()) {
        if (targetId === 'quizLeaderboardPanel') {
            setSignedInQuizView('leaderboard');
        } else if (targetId === 'quizProfilePanel') {
            setSignedInQuizView('profile');
        } else if (targetId === 'quizHistoryPanel') {
            setSignedInQuizView('history');
        } else if (targetId === 'quizWorkspace') {
            setSignedInQuizView('current-quiz');
        } else {
            setSignedInQuizView('quiz-library');
        }
    }

    setActiveQuizSidebarLink(targetId);
    target.scrollIntoView({ behavior, block: 'start' });
}

function bindQuizSidebarNavigation() {
    if (!quizSidebarNavLinks.length) return;

    quizSidebarNavLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href') || '';
            if (!href.startsWith('#')) return;

            const targetId = href.slice(1);
            const target = document.getElementById(targetId);
            if (!target) return;

            event.preventDefault();
            scrollToQuizSection(targetId);
            closeQuizSidebarDrawer();
        });
    });
}

function applyQuizPageState() {
    const signedIn = isLoggedIn();
    const user = getStoredUser();
    const firstName =
        user?.name?.split?.(' ')?.[0] ||
        user?.username?.split?.(' ')?.[0] ||
        user?.email?.split?.('@')?.[0] ||
        'Student';
    const fullLabel = user?.name || user?.username || firstName;
    const secondaryLabel = user?.email || 'Quiz account';

    document.body.classList.toggle('quiz-signed-in', signedIn);

    if (!quizHeroTitle || !quizHeroDescription || !quizHeroPrimaryAction || !quizHeroSecondaryAction) {
        return;
    }

    if (signedIn) {
        if (quizSidebarName) quizSidebarName.textContent = fullLabel;
        if (quizSidebarEmail) quizSidebarEmail.textContent = secondaryLabel;
        if (quizMobileTopbarLabel) quizMobileTopbarLabel.textContent = fullLabel;
        if (quizProfileName) quizProfileName.textContent = fullLabel;
        if (quizProfileEmail) quizProfileEmail.textContent = secondaryLabel;
        if (quizSidebar) quizSidebar.hidden = false;
        if (quizMobileTopbar) quizMobileTopbar.hidden = false;
        if (quizHeroEyebrow) quizHeroEyebrow.textContent = '';
        quizHeroTitle.textContent = 'Continue building your phishing awareness';
        quizHeroDescription.textContent = 'Pick up where you left off, answer more quiz sets, and build a stronger awareness history with every attempt.';
        quizHeroPrimaryAction.textContent = 'Go to Quiz Sets';
        quizHeroPrimaryAction.setAttribute('href', '#quizzes');
        quizHeroSecondaryAction.textContent = 'Start a Quiz';
        quizHeroSecondaryAction.setAttribute('href', '#quizzes');

        if (quizHeroStatValue1) quizHeroStatValue1.textContent = '5';
        if (quizHeroStatLabel1) quizHeroStatLabel1.textContent = 'Ready Quiz Sets';
        if (quizHeroStatValue2) quizHeroStatValue2.textContent = 'Saved';
        if (quizHeroStatLabel2) quizHeroStatLabel2.textContent = 'Attempt History';
        if (quizHeroStatValue3) quizHeroStatValue3.textContent = 'Live';
        if (quizHeroStatLabel3) quizHeroStatLabel3.textContent = 'Progress Tracking';

        if (quizSectionTitle) quizSectionTitle.textContent = 'Available Quizzes';
        if (quizSectionDescription) {
            quizSectionDescription.textContent = 'Choose a quiz set and strengthen your phishing awareness one topic at a time.';
        }

        loadSignedInQuizData();
        setSignedInQuizView('quiz-library');
        if (quizHookPanel) quizHookPanel.hidden = true;
        updateQuizUnlockStates();
        renderQuizPagination();
    } else {
        if (quizSidebar) quizSidebar.hidden = true;
        if (quizMobileTopbar) quizMobileTopbar.hidden = true;
        closeQuizSidebarDrawer();
        if (quizHeroEyebrow) quizHeroEyebrow.textContent = '';
        quizHeroTitle.textContent = 'Test Your Phishing Awareness';
        quizHeroDescription.textContent = 'Challenge yourself with short quiz sets that help students recognize suspicious links, message red flags, and safer online decisions.';
        quizHeroPrimaryAction.textContent = 'Sign In to Track Progress';
        quizHeroPrimaryAction.setAttribute('href', 'login.html?returnTo=quiz.html');
        quizHeroSecondaryAction.textContent = 'Try as Guest';
        quizHeroSecondaryAction.setAttribute('href', '#quizzes');

        if (quizHeroStatValue1) quizHeroStatValue1.textContent = '50+';
        if (quizHeroStatLabel1) quizHeroStatLabel1.textContent = 'Awareness Questions';
        if (quizHeroStatValue2) quizHeroStatValue2.textContent = '5';
        if (quizHeroStatLabel2) quizHeroStatLabel2.textContent = 'Core Quiz Sets';
        if (quizHeroStatValue3) quizHeroStatValue3.textContent = 'Free';
        if (quizHeroStatLabel3) quizHeroStatLabel3.textContent = 'Guest Access';

        if (quizSectionTitle) quizSectionTitle.textContent = 'Available Quizzes';
        if (quizSectionDescription) {
            quizSectionDescription.textContent = 'Choose a quiz set and strengthen your phishing awareness one topic at a time.';
        }

        if (quizProfilePanel) quizProfilePanel.hidden = true;
        if (quizHistoryPanelSection) quizHistoryPanelSection.hidden = true;
        if (quizLeaderboardPanel) quizLeaderboardPanel.hidden = true;
        if (quizzesSection) quizzesSection.hidden = false;
        if (quizHookPanel) quizHookPanel.hidden = false;
        loadGuestLeaderboardPreview();
        updateQuizUnlockStates();
        renderQuizPagination();
    }
}

function formatLeaderboardPreviewScore(entry) {
    const numeric = Number(entry?.averageScore);
    if (Number.isNaN(numeric)) return '--';
    return `${numeric % 1 === 0 ? numeric.toFixed(0) : numeric.toFixed(1)}%`;
}

function renderGuestLeaderboardPreview(entries = []) {
    if (!guestLeaderboardPreview) return;

    guestLeaderboardPreview.innerHTML = '';

    if (!entries.length) {
        const empty = document.createElement('div');
        empty.className = 'quiz-history-empty';
        empty.innerHTML = '<strong>No rankings yet</strong><p>Be one of the first students to save quiz scores and appear on the awareness leaderboard.</p>';
        guestLeaderboardPreview.appendChild(empty);
        return;
    }

    entries.slice(0, 3).forEach((entry) => {
        const row = document.createElement('div');
        row.className = 'leaderboard-row';

        const rank = document.createElement('span');
        rank.className = 'leaderboard-rank';
        rank.textContent = `#${entry.rank}`;

        const name = document.createElement('span');
        name.className = 'leaderboard-name';
        name.textContent = entry.name || 'Anonymous';

        const score = document.createElement('span');
        score.className = 'leaderboard-score';
        score.textContent = formatLeaderboardPreviewScore(entry);

        row.append(rank, name, score);

        guestLeaderboardPreview.appendChild(row);
    });
}

async function loadGuestLeaderboardPreview() {
    if (isLoggedIn() || !guestLeaderboardPreview) return;

    try {
        const data = await apiFetch('/api/quiz/public-leaderboard');
        renderGuestLeaderboardPreview(Array.isArray(data?.leaderboard) ? data.leaderboard : []);
    } catch (error) {
        console.warn('Guest leaderboard preview fallback:', error.message || error);
        renderGuestLeaderboardPreview([]);
    }
}

async function loadSignedInQuizData() {
    if (!isLoggedIn()) return;

    try {
        const [attemptData, leaderboardData] = await Promise.all([
            apiFetch('/api/quiz/attempts'),
            apiFetch('/api/quiz/leaderboard')
        ]);

        signedInQuizAttempts = Array.isArray(attemptData?.attempts) ? attemptData.attempts : [];
        renderGroupedQuizHistory(signedInQuizAttempts);
        populateQuizHistoryArchive(signedInQuizAttempts);
        populateQuizProfile(signedInQuizAttempts);
        updateQuizUnlockStates(signedInQuizAttempts);
        renderQuizLeaderboard(
            Array.isArray(leaderboardData?.leaderboard) ? leaderboardData.leaderboard : [],
            leaderboardData?.currentUserId || '',
            leaderboardData?.minimumAttempts || 2
        );
    } catch (error) {
        console.warn('Quiz dashboard data fallback:', error.message || error);
        signedInQuizAttempts = [];
        renderGroupedQuizHistory([]);
        populateQuizHistoryArchive([]);
        populateQuizProfile([]);
        updateQuizUnlockStates([]);
        renderQuizLeaderboard([], '', 2);
    }
}

async function saveSignedInAttempt(result) {
    if (!isLoggedIn()) return null;

    const response = await apiFetch('/api/quiz/attempts', {
        method: 'POST',
        body: JSON.stringify(result)
    });

    return response?.attempt || null;
}

function buildQuizAttemptReviewData(quiz, answerRecords = []) {
    return quiz.questions.map((question, questionIndex) => {
        const answerRecord = answerRecords.find((entry) => entry.questionIndex === questionIndex) || {};
        const selectedIndex = Number.isInteger(answerRecord.selected) ? answerRecord.selected : null;
        const correctIndex = Number.isInteger(question.answer) ? question.answer : null;

        return {
            questionIndex,
            topic: question.topic,
            prompt: question.prompt,
            options: Array.isArray(question.options) ? question.options : [],
            selectedIndex,
            correctIndex,
            selectedAnswer: selectedIndex !== null ? question.options[selectedIndex] || '' : '',
            correctAnswer: correctIndex !== null ? question.options[correctIndex] || '' : '',
            isCorrect: selectedIndex !== null && selectedIndex === correctIndex,
            explanation: question.explanation || ''
        };
    });
}

function populateSignedInDashboard(attempts = []) {
    renderGroupedQuizHistory(attempts);
    populateQuizHistoryArchive(attempts);
    populateQuizProfile(attempts);
}

function renderGroupedQuizHistory(attempts = []) {
    const reviewAttempts = attempts.filter((attempt) => Number(attempt.percentage || 0) < 75);
    const otherAttempts = attempts.filter((attempt) => Number(attempt.percentage || 0) >= 75);

    renderQuizHistory(reviewAttempts, {
        badgeElement: quizHistoryReviewBadge,
        listElement: quizHistoryReviewList,
        emptyElement: quizHistoryReviewEmpty,
        limit: 100
    });

    renderQuizHistory(otherAttempts, {
        badgeElement: quizHistoryOtherBadge,
        listElement: quizHistoryOtherList,
        emptyElement: quizHistoryOtherEmpty,
        limit: 100
    });
}

function populateQuizHistoryArchive(attempts = []) {
    const attemptsCount = attempts.length;
    const bestScore = attemptsCount
        ? attempts.reduce((best, attempt) => Math.max(best, Number(attempt.percentage || 0)), 0)
        : null;
    const reviewCount = attempts.filter((attempt) => Number(attempt.percentage || 0) < 75).length;

    if (quizHistoryArchiveAttempts) quizHistoryArchiveAttempts.textContent = String(attemptsCount);
    if (quizHistoryArchiveBest) quizHistoryArchiveBest.textContent = bestScore === null ? '--' : `${Math.round(bestScore)}%`;
    if (quizHistoryArchiveReview) quizHistoryArchiveReview.textContent = String(reviewCount);
}

function populateQuizProfile(attempts = []) {
    if (quizProfileAttempts) {
        quizProfileAttempts.textContent = String(attempts.length);
    }
    renderQuizBadges(attempts);

    if (!attempts.length) {
        if (quizProfileAverage) quizProfileAverage.textContent = '--';
        if (quizProfileBest) quizProfileBest.textContent = '--';
        renderQuizTopicProgress([]);
        return;
    }

    const averageScore = Math.round(
        attempts.reduce((total, attempt) => total + Number(attempt.percentage || 0), 0) / attempts.length
    );
    const bestScore = attempts.reduce((best, attempt) => (
        Number(attempt.percentage || 0) > best ? Number(attempt.percentage || 0) : best
    ), 0);

    if (quizProfileAverage) quizProfileAverage.textContent = `${averageScore}%`;
    if (quizProfileBest) quizProfileBest.textContent = `${bestScore}%`;
    renderQuizTopicProgress(attempts);
}

function getQuizBadgeDefinitions(attempts = []) {
    const averageScore = attempts.length
        ? Math.round(attempts.reduce((total, attempt) => total + Number(attempt.percentage || 0), 0) / attempts.length)
        : 0;
    const bestScore = attempts.reduce((best, attempt) => (
        Number(attempt.percentage || 0) > best ? Number(attempt.percentage || 0) : best
    ), 0);
    const uniqueTopics = new Set(attempts.map((attempt) => attempt.quizId)).size;

    return [
        {
            id: 'first-step',
            title: 'First Step',
            detail: 'Complete your first signed-in quiz attempt.',
            earned: attempts.length >= 1,
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 3 7v6c0 5 3.84 9.74 9 11 5.16-1.26 9-6 9-11V7l-9-5Zm-1 14-4-4 1.41-1.41L11 13.17l5.59-5.58L18 9l-7 7Z"/></svg>'
        },
        {
            id: 'practice-streak',
            title: 'Practice Streak',
            detail: 'Save at least 3 quiz attempts.',
            earned: attempts.length >= 3,
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>'
        },
        {
            id: 'sharp-eye',
            title: 'Sharp Eye',
            detail: 'Reach a best score of 90% or higher.',
            earned: bestScore >= 90,
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-2.2A1.8 1.8 0 1 0 12 10a1.8 1.8 0 0 0 0 3.6Z"/></svg>'
        },
        {
            id: 'steady-awareness',
            title: 'Steady Awareness',
            detail: 'Maintain an average score of 75% or higher.',
            earned: averageScore >= 75 && attempts.length >= 2,
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17h3v4H3v-4Zm5-7h3v11H8V10Zm5 3h3v8h-3v-8Zm5-10h3v18h-3V3Z"/></svg>'
        },
        {
            id: 'topic-explorer',
            title: 'Topic Explorer',
            detail: 'Try at least 3 different quiz sets.',
            earned: uniqueTopics >= 3,
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Zm1 14h-2v-2h2v2Zm0-4h-2V7h2v5Z"/></svg>'
        },
        {
            id: 'full-coverage',
            title: 'Full Coverage',
            detail: 'Complete the full core quiz path.',
            earned: coreQuizIds.every((quizId) => attempts.some((attempt) => attempt.quizId === quizId)),
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-8 9-3-3 1.41-1.41L11 9.17l4.59-4.58L17 6l-6 6Z"/></svg>'
        }
    ];
}

function getQuizBadgeIconMarkup(badgeId = '') {
    const iconMap = {
        'first-step': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 3 7v6c0 5 3.84 9.74 9 11 5.16-1.26 9-6 9-11V7l-9-5Zm-1 14-4-4 1.41-1.41L11 13.17l5.59-5.58L18 9l-7 7Z"/></svg>',
        'practice-streak': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>',
        'sharp-eye': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-2.2A1.8 1.8 0 1 0 12 10a1.8 1.8 0 0 0 0 3.6Z"/></svg>',
        'steady-awareness': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17h3v4H3v-4Zm5-7h3v11H8V10Zm5 3h3v8h-3v-8Zm5-10h3v18h-3V3Z"/></svg>',
        'topic-explorer': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Zm1 14h-2v-2h2v2Zm0-4h-2V7h2v5Z"/></svg>',
        'full-coverage': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-8 9-3-3 1.41-1.41L11 9.17l4.59-4.58L17 6l-6 6Z"/></svg>'
    };

    return iconMap[badgeId] || '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Z"/></svg>';
}

function createPlaceholderQuizCards() {
    if (!quizGrid) return;

    const desiredCardCount = totalQuizPages * quizCardsPerPage;
    const placeholdersNeeded = Math.max(0, desiredCardCount - quizCards.length);

    for (let index = 0; index < placeholdersNeeded; index += 1) {
        const card = document.createElement('article');
        card.className = 'quiz-card quiz-card-placeholder is-locked';
        card.dataset.quizCard = `placeholder-${index + 1}`;
        card.innerHTML = `
            <div class="quiz-card-header">
                <span class="quiz-badge">Coming Soon</span>
            </div>
            <h3>Upcoming Quiz Set ${index + 1}</h3>
            <p>More phishing awareness quizzes will appear here as we expand the learning path with new scenarios and practice sets.</p>
            <div class="quiz-meta">
                <span>New Set</span>
                <span>Preview</span>
                <span class="difficulty">Soon</span>
            </div>
            <button type="button" class="quiz-start-btn" disabled>Coming Soon</button>
        `;
        quizGrid.appendChild(card);
        quizCards.push(card);
    }
}

function renderQuizPagination() {
    if (!quizPagination || !quizCards.length) return;

    if (!isLoggedIn()) {
        quizCards.forEach((card, index) => {
            card.hidden = index >= quizCardsPerPage;
        });
        quizPagination.innerHTML = '';
        quizPagination.hidden = true;
        return;
    }

    quizPagination.hidden = false;

    const totalPages = Math.max(totalQuizPages, Math.ceil(quizCards.length / quizCardsPerPage));
    currentQuizPage = Math.min(Math.max(currentQuizPage, 1), totalPages);

    quizCards.forEach((card, index) => {
        const pageNumber = Math.floor(index / quizCardsPerPage) + 1;
        card.hidden = pageNumber !== currentQuizPage;
    });

    quizPagination.innerHTML = '';

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `quiz-page-tab${pageNumber === currentQuizPage ? ' is-active' : ''}`;
        button.textContent = String(pageNumber);
        button.setAttribute('aria-label', `Show quiz page ${pageNumber}`);
        if (pageNumber === currentQuizPage) {
            button.setAttribute('aria-current', 'page');
        }
        button.addEventListener('click', () => {
            currentQuizPage = pageNumber;
            renderQuizPagination();
            quizzesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        quizPagination.appendChild(button);
    }
}

function renderQuizBadges(attempts = []) {
    if (!quizProfileBadgeList) return;

    const badges = getQuizBadgeDefinitions(attempts);
    const unlockedCount = badges.filter((badge) => badge.earned).length;

    if (quizProfileBadgeCount) {
        quizProfileBadgeCount.textContent = `${unlockedCount} unlocked`;
    }

    quizProfileBadgeList.querySelectorAll('.quiz-profile-badge').forEach((item) => item.remove());

    if (!badges.some((badge) => badge.earned)) {
        if (quizProfileBadgeEmpty) quizProfileBadgeEmpty.hidden = false;
    } else if (quizProfileBadgeEmpty) {
        quizProfileBadgeEmpty.hidden = true;
    }

    badges.forEach((badge) => {
        const item = document.createElement('article');
        item.className = `quiz-profile-badge ${badge.earned ? 'is-earned' : 'is-locked'}`;
        item.innerHTML = `
            <div class="quiz-profile-badge-top">
                <div class="quiz-profile-badge-icon" aria-hidden="true">${badge.icon}</div>
                <div class="quiz-profile-badge-main">
                    <strong>${badge.title}</strong>
                    <span>${badge.earned ? 'Unlocked' : 'Locked'}</span>
                </div>
            </div>
            <p class="quiz-profile-badge-note">${badge.detail}</p>
        `;
        quizProfileBadgeList.appendChild(item);
    });
}

function renderQuizHistory(attempts, options = {}) {
    const {
        badgeElement = null,
        listElement = quizHistoryOtherList,
        emptyElement = quizHistoryOtherEmpty,
        limit = 6,
        compact = false
    } = options;

    if (!listElement) return;

    if (badgeElement) {
        badgeElement.textContent = `${attempts.length} attempt${attempts.length === 1 ? '' : 's'}`;
    }

    if (!attempts.length) {
        if (emptyElement) emptyElement.hidden = false;
        listElement.querySelectorAll('.quiz-history-item').forEach((item) => item.remove());
        return;
    }

    if (emptyElement) emptyElement.hidden = true;
    listElement.querySelectorAll('.quiz-history-item').forEach((item) => item.remove());

    attempts.slice(0, limit).forEach((attempt) => {
        const percentage = Math.round(Number(attempt.percentage || 0));
        const statusLabel = percentage >= 90
            ? 'Strong'
            : percentage >= 75
                ? 'Improving'
                : 'Needs Review';
        const item = document.createElement('article');
        const historyBandClass = percentage >= 90
            ? 'is-strong'
            : percentage >= 75
                ? 'is-improving'
                : 'is-needs-review';
        item.className = `quiz-history-item is-clickable ${historyBandClass}`;
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.innerHTML = `
            <div class="quiz-history-main">
                <strong>${attempt.quizTitle}</strong>
                <span>${new Date(attempt.createdAt).toLocaleDateString()} - ${attempt.score}/${attempt.totalQuestions} correct</span>
            </div>
            <div class="quiz-history-side">
                <span class="quiz-history-status ${statusLabel.toLowerCase().replace(/\s+/g, '-')}">${statusLabel}</span>
                ${compact ? '' : '<span class="quiz-history-review-hint">View Review</span>'}
                <div class="quiz-history-score-wrap">
                    <span class="quiz-history-score">${percentage}%</span>
                    ${compact ? '' : '<span class="quiz-history-arrow" aria-hidden="true">&rsaquo;</span>'}
                </div>
            </div>
        `;
        item.addEventListener('click', () => openQuizAttemptReview(attempt.id));
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openQuizAttemptReview(attempt.id);
            }
        });
        listElement.appendChild(item);
    });
}

async function openQuizAttemptReview(attemptId) {
    if (!attemptId || !quizAttemptReviewOverlay || !quizAttemptReviewBody) return;

    quizAttemptReviewOverlay.hidden = false;
    document.body.classList.add('modal-open');
    quizAttemptReviewBody.innerHTML = `
        <div class="quiz-history-empty">
            <strong>Loading attempt</strong>
            <p>Please wait while we load the quiz review.</p>
        </div>
    `;

    try {
        const data = await apiFetch(`/api/quiz/attempts/${attemptId}`);
        renderQuizAttemptReview(data?.attempt || null);
    } catch (error) {
        quizAttemptReviewBody.innerHTML = `
            <div class="quiz-history-empty">
                <strong>Could not load attempt</strong>
                <p>${escapeHtml(error.message || 'Please try again.')}</p>
            </div>
        `;
    }
}

function closeQuizAttemptReview() {
    if (!quizAttemptReviewOverlay) return;
    quizAttemptReviewOverlay.hidden = true;
    document.body.classList.remove('modal-open');
}

function renderQuizAttemptReview(attempt) {
    if (!quizAttemptReviewBody) return;
    if (!attempt) {
        quizAttemptReviewBody.innerHTML = `
            <div class="quiz-history-empty">
                <strong>Attempt not available</strong>
                <p>The quiz review could not be loaded right now.</p>
            </div>
        `;
        return;
    }

    const reviewData = Array.isArray(attempt.reviewData) ? attempt.reviewData : [];
    if (!reviewData.length) {
        quizAttemptReviewBody.innerHTML = `
            <div class="quiz-history-empty">
                <strong>No review data for this attempt</strong>
                <p>This attempt was saved before answer review was enabled. New attempts will show full right and wrong breakdowns here.</p>
            </div>
        `;
        return;
    }

    quizAttemptReviewBody.innerHTML = `
        <div class="quiz-attempt-review-summary">
            <div class="quiz-attempt-review-score">${escapeHtml(Math.round(attempt.percentage))}%</div>
            <div class="quiz-attempt-review-copy">
                <p class="quiz-dashboard-kicker">Saved Result</p>
                <h4>${escapeHtml(attempt.quizTitle)}</h4>
                <p>${escapeHtml(`${attempt.score}/${attempt.totalQuestions} correct - ${new Date(attempt.createdAt).toLocaleDateString()}`)}</p>
            </div>
        </div>
        <div class="quiz-attempt-review-list">
            ${reviewData.map((item, index) => `
                <article class="quiz-attempt-review-item ${item.isCorrect ? 'is-correct' : 'is-incorrect'}">
                    <div class="quiz-attempt-review-head">
                        <div>
                            <p class="quiz-dashboard-kicker">Question ${index + 1}${item.topic ? ` - ${escapeHtml(item.topic)}` : ''}</p>
                            <h5>${escapeHtml(item.prompt || 'Question')}</h5>
                        </div>
                        <span class="quiz-attempt-review-status">${item.isCorrect ? 'Correct' : 'Review Needed'}</span>
                    </div>
                    <div class="quiz-attempt-review-options">
                        ${(Array.isArray(item.options) ? item.options : []).map((option, optionIndex) => `
                            <div class="quiz-attempt-review-option ${optionIndex === item.correctIndex ? 'is-answer' : ''} ${optionIndex === item.selectedIndex ? 'is-selected' : ''}">
                                <span>${escapeHtml(option)}</span>
                                <small>
                                    ${optionIndex === item.correctIndex ? 'Correct answer' : optionIndex === item.selectedIndex ? 'Your answer' : ''}
                                </small>
                            </div>
                        `).join('')}
                    </div>
                    <p class="quiz-attempt-review-explanation">${escapeHtml(item.explanation || '')}</p>
                </article>
            `).join('')}
        </div>
    `;
}

function renderQuizTopicProgress(attempts = []) {
    if (!quizProfileProgressList) return;

    const topics = Object.entries(quizzes).map(([quizId, quiz]) => {
        const matchingAttempts = attempts.filter((attempt) => attempt.quizId === quizId);
        const averageScore = matchingAttempts.length
            ? Math.round(matchingAttempts.reduce((total, attempt) => total + Number(attempt.percentage || 0), 0) / matchingAttempts.length)
            : null;

        return {
            quizId,
            title: quiz.title,
            attemptsCount: matchingAttempts.length,
            averageScore
        };
    });

    if (quizProfileProgressBadge) {
        const activeTopics = topics.filter((topic) => topic.attemptsCount > 0).length;
        quizProfileProgressBadge.textContent = `${activeTopics} topic${activeTopics === 1 ? '' : 's'}`;
    }

    if (!topics.some((topic) => topic.attemptsCount > 0)) {
        if (quizProfileProgressEmpty) quizProfileProgressEmpty.hidden = false;
        quizProfileProgressList.querySelectorAll('.quiz-profile-progress-item').forEach((item) => item.remove());
        return;
    }

    if (quizProfileProgressEmpty) quizProfileProgressEmpty.hidden = true;
    quizProfileProgressList.querySelectorAll('.quiz-profile-progress-item').forEach((item) => item.remove());

    topics
        .filter((topic) => topic.attemptsCount > 0)
        .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
        .forEach((topic) => {
            const item = document.createElement('article');
            item.className = 'quiz-profile-progress-item';
            item.innerHTML = `
                <div class="quiz-profile-progress-top">
                    <div class="quiz-profile-progress-main">
                        <strong>${topic.title}</strong>
                        <span>${topic.attemptsCount} attempt${topic.attemptsCount === 1 ? '' : 's'} completed</span>
                    </div>
                    <span class="quiz-profile-progress-score">${topic.averageScore}%</span>
                </div>
                <div class="quiz-profile-progress-bar" aria-hidden="true">
                    <span style="width: ${topic.averageScore}%"></span>
                </div>
            `;
            quizProfileProgressList.appendChild(item);
        });
}

function renderQuizLeaderboard(entries, currentUserId, minimumAttempts = 2) {
    if (!quizLeaderboardList) return;

    if (!entries.length) {
        if (quizLeaderboardEmpty) quizLeaderboardEmpty.hidden = false;
        const heading = quizLeaderboardEmpty.querySelector('strong');
        const copy = quizLeaderboardEmpty.querySelector('p');
        if (heading) heading.textContent = 'No leaderboard data yet';
        if (copy) copy.textContent = `The leaderboard appears once users have at least ${minimumAttempts} saved quiz attempts.`;
        quizLeaderboardList.querySelectorAll('.quiz-leaderboard-item').forEach((item) => item.remove());
        return;
    }

    if (quizLeaderboardEmpty) quizLeaderboardEmpty.hidden = true;
    quizLeaderboardList.querySelectorAll('.quiz-leaderboard-item').forEach((item) => item.remove());

    entries.forEach((entry) => {
        const item = document.createElement('article');
        item.className = 'quiz-leaderboard-item is-clickable';
        if (entry.rank === 1) item.classList.add('is-rank-1');
        if (entry.rank === 2) item.classList.add('is-rank-2');
        if (entry.rank === 3) item.classList.add('is-rank-3');
        if (currentUserId && entry.userId === currentUserId) {
            item.classList.add('is-current-user');
        }
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');

        item.innerHTML = `
            <div class="quiz-leaderboard-rank">#${entry.rank}</div>
            <div class="quiz-leaderboard-main">
                <strong>${entry.name}</strong>
                <span>${entry.attemptsCount} attempt${entry.attemptsCount === 1 ? '' : 's'} - Best ${Math.round(entry.bestScore)}%</span>
            </div>
            <div class="quiz-leaderboard-score-wrap">
                <span class="quiz-leaderboard-score-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3 9.5 8H4l4.2 4.1-.99 5.79L12 15.2l4.79 2.69L15.8 12 20 8h-5.5L12 3Z"/>
                    </svg>
                </span>
                <div class="quiz-leaderboard-score-block">
                    <span class="quiz-leaderboard-score-label">Average Score</span>
                    <div class="quiz-leaderboard-score">${Math.round(entry.averageScore)}%</div>
                </div>
            </div>
        `;
        item.addEventListener('click', () => openPublicQuizProfile(entry.userId));
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openPublicQuizProfile(entry.userId);
            }
        });
        quizLeaderboardList.appendChild(item);
    });
}

async function openPublicQuizProfile(userId) {
    if (!quizPublicProfileOverlay || !quizPublicProfileBody || !userId) return;

    quizPublicProfileOverlay.hidden = false;
    document.body.classList.add('modal-open');
    quizPublicProfileBody.innerHTML = `
        <div class="quiz-history-empty">
            <strong>Loading profile</strong>
            <p>Please wait while we load the public quiz stats.</p>
        </div>
    `;

    try {
        const data = await apiFetch(`/api/quiz/public-profile/${userId}`);
        renderPublicQuizProfile(data?.profile || null);
    } catch (error) {
        quizPublicProfileBody.innerHTML = `
            <div class="quiz-history-empty">
                <strong>Could not load profile</strong>
                <p>${escapeHtml(error.message || 'Please try again.')}</p>
            </div>
        `;
    }
}

function closePublicQuizProfile() {
    if (!quizPublicProfileOverlay) return;
    quizPublicProfileOverlay.hidden = true;
    document.body.classList.remove('modal-open');
}

function renderPublicQuizProfile(profile) {
    if (!quizPublicProfileBody) return;
    if (!profile) {
        quizPublicProfileBody.innerHTML = `
            <div class="quiz-history-empty">
                <strong>Profile not available</strong>
                <p>The public quiz profile could not be loaded right now.</p>
            </div>
        `;
        return;
    }

    const lastAttempt = profile.lastAttemptAt
        ? new Date(profile.lastAttemptAt).toLocaleDateString()
        : 'No attempts yet';

    const badges = Array.isArray(profile.badges) ? profile.badges : [];
    const unlockedBadges = badges.filter((badge) => badge.earned);
    const topics = Array.isArray(profile.topics) ? profile.topics : [];

    quizPublicProfileBody.innerHTML = `
        <div class="quiz-public-profile-grid">
            <div class="quiz-public-profile-summary">
                <section class="quiz-public-profile-hero">
                    <div class="quiz-public-profile-head">
                        <div class="quiz-public-profile-avatar" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="quiz-dashboard-kicker">Public Stats</p>
                            <h4>${escapeHtml(profile.name)}</h4>
                            <p class="quiz-public-profile-subtext">Last saved attempt: ${escapeHtml(lastAttempt)}</p>
                        </div>
                    </div>

                    <div class="quiz-public-profile-stat-grid">
                        <div class="quiz-public-profile-stat">
                            <span>Total Attempts</span>
                            <strong>${escapeHtml(profile.attemptsCount)}</strong>
                        </div>
                        <div class="quiz-public-profile-stat">
                            <span>Average Score</span>
                            <strong>${escapeHtml(Math.round(profile.averageScore || 0))}%</strong>
                        </div>
                        <div class="quiz-public-profile-stat">
                            <span>Best Score</span>
                            <strong>${escapeHtml(Math.round(profile.bestScore || 0))}%</strong>
                        </div>
                        <div class="quiz-public-profile-stat">
                            <span>Completed Topics</span>
                            <strong>${escapeHtml(topics.length)}</strong>
                        </div>
                    </div>
                </section>

                <section class="quiz-public-profile-card">
                    <div class="quiz-history-heading">
                        <div>
                            <p class="quiz-dashboard-kicker">Earned Badges</p>
                            <h3>Awareness Milestones</h3>
                        </div>
                        <span class="quiz-history-badge">${unlockedBadges.length} unlocked</span>
                    </div>
                    <div class="quiz-public-profile-badges">
                        ${unlockedBadges.length ? unlockedBadges.map((badge) => `
                            <article
                                class="quiz-public-profile-badge ${badge.earned ? 'is-earned' : ''}"
                                title="${escapeHtml(`${badge.title} - ${badge.earned ? 'Unlocked' : 'Locked'}`)}"
                                aria-label="${escapeHtml(`${badge.title} - ${badge.earned ? 'Unlocked' : 'Locked'}`)}"
                            >
                                <span class="quiz-public-profile-badge-icon" aria-hidden="true">${getQuizBadgeIconMarkup(badge.id)}</span>
                            </article>
                        `).join('') : `
                            <div class="quiz-history-empty">
                                <strong>No public badges yet</strong>
                                <p>This user has not unlocked any public awareness badges yet.</p>
                            </div>
                        `}
                    </div>
                </section>
            </div>

            <section class="quiz-public-profile-card">
                <div class="quiz-history-heading">
                    <div>
                        <p class="quiz-dashboard-kicker">Topic Progress</p>
                        <h3>Performance by Quiz Set</h3>
                    </div>
                    <span class="quiz-history-badge">${topics.length} topic${topics.length === 1 ? '' : 's'}</span>
                </div>
                <div class="quiz-public-profile-progress">
                    ${topics.length ? topics.map((topic) => `
                        <article class="quiz-profile-progress-item">
                            <div class="quiz-profile-progress-top">
                                <div class="quiz-profile-progress-main">
                                    <strong>${escapeHtml(topic.quizTitle)}</strong>
                                    <span>${escapeHtml(topic.attemptsCount)} attempt${topic.attemptsCount === 1 ? '' : 's'} completed</span>
                                </div>
                                <span class="quiz-profile-progress-score">${escapeHtml(Math.round(topic.averageScore || 0))}%</span>
                            </div>
                            <div class="quiz-profile-progress-bar" aria-hidden="true">
                                <span style="width: ${Math.max(0, Math.min(100, Math.round(topic.averageScore || 0)))}%"></span>
                            </div>
                        </article>
                    `).join('') : `
                        <div class="quiz-history-empty">
                            <strong>No topic progress yet</strong>
                            <p>This user does not have enough saved quiz data to show here yet.</p>
                        </div>
                    `}
                </div>
            </section>
        </div>
    `;
}

function getScoreSummary(percentage) {
    if (percentage >= 90) {
        return 'Strong awareness. You consistently noticed the safer choices in these phishing-related situations.';
    }
    if (percentage >= 75) {
        return 'Good awareness overall. You caught most of the warning signs, but a few situations still need more caution.';
    }
    if (percentage >= 50) {
        return 'Fair start. You noticed some phishing signals, but more practice will help you react more safely.';
    }
    return 'This quiz needs another pass. Focus on checking links carefully, verifying requests, and slowing down before acting.';
}

function getQuizGradeClass(grade) {
    return `grade-${String(grade || 'f').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function updateWorkspaceVisibility(showResults = false) {
    if (!quizWorkspace) return;
    quizWorkspace.hidden = false;
    quizQuestionCard.hidden = showResults;
    quizResultCard.hidden = !showResults;

    if (!isLoggedIn()) {
        document.body.classList.add('guest-quiz-open');
    }
}

function scrollToWorkspace() {
    scrollToQuizSection('quizWorkspace');
}

function renderQuestion() {
    const quiz = quizzes[currentQuizId];
    const question = quiz?.questions[currentQuestionIndex];
    if (!quiz || !question) return;

    selectedAnswerIndex = null;
    quizSessionTitle.textContent = quiz.title;
    quizSessionDesc.textContent = quiz.description;
    quizQuestionTopic.textContent = `${quiz.title} - ${question.topic}`;
    quizQuestionText.textContent = question.prompt;
    quizQuestionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${quiz.questions.length}`;
    quizProgressFill.style.width = `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`;
    quizFeedback.hidden = true;
    quizFeedback.innerHTML = '';
    quizNextBtn.disabled = true;
    quizNextBtn.textContent = currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question';

    quizOptions.innerHTML = '';

    question.options.forEach((option, optionIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'quiz-option';
        button.innerHTML = `
            <span class="quiz-option-key">${String.fromCharCode(65 + optionIndex)}</span>
            <span class="quiz-option-text">${option}</span>
        `;
        button.addEventListener('click', () => handleAnswerSelection(optionIndex));
        quizOptions.appendChild(button);
    });

    updateWorkspaceVisibility(false);
}

function handleAnswerSelection(optionIndex) {
    if (selectedAnswerIndex !== null) return;

    const quiz = quizzes[currentQuizId];
    const question = quiz.questions[currentQuestionIndex];
    const optionButtons = [...quizOptions.querySelectorAll('.quiz-option')];
    selectedAnswerIndex = optionIndex;

    const isCorrect = optionIndex === question.answer;
    if (isCorrect) score += 1;

    answers.push({
        questionIndex: currentQuestionIndex,
        selected: optionIndex,
        correct: question.answer,
        isCorrect
    });

    optionButtons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.answer) {
            button.classList.add('is-correct');
        }
        if (index === optionIndex && !isCorrect) {
            button.classList.add('is-incorrect');
        }
        if (index === optionIndex) {
            button.classList.add('is-selected');
        }
    });

    quizFeedback.hidden = false;
    quizFeedback.innerHTML = `<strong>${isCorrect ? 'Correct.' : 'Not quite.'}</strong> ${question.explanation}`;
    quizNextBtn.disabled = false;
}

function showResults() {
    const quiz = quizzes[currentQuizId];
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    quizResultScore.textContent = `${percentage}%`;
    quizResultTitle.textContent = percentage >= 75 ? 'Good phishing awareness result' : 'Keep building your phishing awareness';
    quizResultSummary.textContent = getScoreSummary(percentage);
    quizCorrectCount.textContent = `${score} / ${totalQuestions}`;
    quizResultQuizName.textContent = quiz.title;
    if (quizResultCard) {
        quizResultCard.classList.remove(
            'grade-a-plus',
            'grade-a',
            'grade-b-plus',
            'grade-b',
            'grade-c-plus',
            'grade-c',
            'grade-d',
            'grade-f'
        );
        if (percentage >= 95) quizResultCard.classList.add(getQuizGradeClass('A+'));
        else if (percentage >= 90) quizResultCard.classList.add(getQuizGradeClass('A'));
        else if (percentage >= 85) quizResultCard.classList.add(getQuizGradeClass('B+'));
        else if (percentage >= 80) quizResultCard.classList.add(getQuizGradeClass('B'));
        else if (percentage >= 75) quizResultCard.classList.add(getQuizGradeClass('C+'));
        else if (percentage >= 70) quizResultCard.classList.add(getQuizGradeClass('C'));
        else if (percentage >= 65) quizResultCard.classList.add(getQuizGradeClass('D'));
        else quizResultCard.classList.add(getQuizGradeClass('F'));
    }

    if (isLoggedIn()) {
        guestQuizPrompt.hidden = true;
        saveSignedInAttempt({
            quizId: currentQuizId,
            quizTitle: quiz.title,
            score,
            totalQuestions,
            percentage,
            reviewData: buildQuizAttemptReviewData(quiz, answers)
        }).then(() => {
            loadSignedInQuizData();
        }).catch((error) => {
            console.warn('Quiz attempt save failed:', error.message || error);
        });
    } else {
        guestQuizPrompt.hidden = false;
    }

    updateWorkspaceVisibility(true);
    scrollToWorkspace();
}

function startQuiz(quizId) {
    if (!quizzes[quizId]) return;

    currentQuizId = quizId;
    currentQuestionIndex = 0;
    selectedAnswerIndex = null;
    score = 0;
    answers = [];

    if (isLoggedIn()) {
        setSignedInQuizView('current-quiz');
    }

    renderQuestion();
    scrollToWorkspace();
}

function resetQuizWorkspace() {
    currentQuizId = null;
    currentQuestionIndex = 0;
    selectedAnswerIndex = null;
    score = 0;
    answers = [];

    document.body.classList.remove('guest-quiz-open');

    if (quizWorkspace) quizWorkspace.hidden = true;
    if (quizFeedback) {
        quizFeedback.hidden = true;
        quizFeedback.innerHTML = '';
    }

    if (isLoggedIn()) {
        setSignedInQuizView('quiz-library');
    }
}

quizStartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const action = button.dataset.lockedAction || 'start';
        if (action === 'login') {
            window.location.href = 'login.html?returnTo=quiz.html';
            return;
        }
        if (action === 'locked') {
            return;
        }
        startQuiz(button.dataset.quiz);
    });
});

quizNextBtn?.addEventListener('click', () => {
    const quiz = quizzes[currentQuizId];
    if (!quiz || selectedAnswerIndex === null) return;

    if (currentQuestionIndex === quiz.questions.length - 1) {
        showResults();
        return;
    }

    currentQuestionIndex += 1;
    renderQuestion();
});

quizRetryBtn?.addEventListener('click', () => {
    if (!currentQuizId) return;
    startQuiz(currentQuizId);
});

quizChooseAnotherBtn?.addEventListener('click', () => {
    resetQuizWorkspace();
    document.getElementById('quizzes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

quizExitBtn?.addEventListener('click', () => {
    resetQuizWorkspace();
    document.getElementById('quizzes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

quizSidebarStartBtn?.addEventListener('click', () => {
    const recommendedQuizId = getRecommendedQuizId(signedInQuizAttempts);
    startQuiz(recommendedQuizId);
    closeQuizSidebarDrawer();
});

quizSidebarProfileBtn?.addEventListener('click', () => {
    if (!isLoggedIn()) return;
    setSignedInQuizView('profile');
    closeQuizSidebarDrawer();
    quizProfilePanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

quizSidebarLogoutBtn?.addEventListener('click', () => {
    openQuizLogoutConfirm();
});

quizSidebarToggle?.addEventListener('click', () => {
    toggleQuizSidebarDrawer();
});

quizSidebarBackBtn?.addEventListener('click', (event) => {
    if (!shouldUseQuizSidebarDrawer()) return;
    event.preventDefault();
    closeQuizSidebarDrawer();
});

quizSidebarOverlay?.addEventListener('click', () => {
    closeQuizSidebarDrawer();
});

quizPublicProfileClose?.addEventListener('click', () => {
    closePublicQuizProfile();
});

quizPublicProfileOverlay?.addEventListener('click', (event) => {
    if (event.target === quizPublicProfileOverlay) {
        closePublicQuizProfile();
    }
});

quizAttemptReviewClose?.addEventListener('click', () => {
    closeQuizAttemptReview();
});

quizAttemptReviewOverlay?.addEventListener('click', (event) => {
    if (event.target === quizAttemptReviewOverlay) {
        closeQuizAttemptReview();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('quiz-sidebar-open')) {
        closeQuizSidebarDrawer();
    }
    if (event.key === 'Escape' && quizPublicProfileOverlay && !quizPublicProfileOverlay.hidden) {
        closePublicQuizProfile();
    }
    if (event.key === 'Escape' && quizAttemptReviewOverlay && !quizAttemptReviewOverlay.hidden) {
        closeQuizAttemptReview();
    }
    if (event.key === 'Escape' && quizLogoutConfirmOverlay && !quizLogoutConfirmOverlay.hidden) {
        closeQuizLogoutConfirm();
    }
});

quizLogoutCancelBtn?.addEventListener('click', () => {
    closeQuizLogoutConfirm();
});

quizLogoutConfirmBtn?.addEventListener('click', async () => {
    closeQuizLogoutConfirm();
    await handleQuizLogout();
});

quizLogoutConfirmOverlay?.addEventListener('click', (event) => {
    if (event.target === quizLogoutConfirmOverlay) {
        closeQuizLogoutConfirm();
    }
});

window.addEventListener('resize', () => {
    if (!shouldUseQuizSidebarDrawer()) {
        closeQuizSidebarDrawer();
    }
});

bindQuizSidebarNavigation();

if (isLoggedIn()) {
    setActiveQuizSidebarLink('quizzes');
}




