/* ====== Quiz App Interactivity ====== */

// Simulate user login state (false = not logged in)
let isLoggedIn = false;

// Quiz data
const quizzes = {
    'url-basics': {
        title: 'URL Basics',
        description: 'Learn to identify suspicious URLs and recognize common phishing tactics used in emails.'
    },
    'message-red-flags': {
        title: 'Message Red Flags',
        description: 'Master the art of spotting warning signs in emails, texts, and messages that indicate phishing attempts.'
    },
    'after-clicking': {
        title: 'After Clicking: What to Do?',
        description: 'Test your knowledge on steps to take if you\'ve clicked a suspicious link or provided sensitive information.'
    },
    'phishing-scenarios': {
        title: 'Phishing Scenarios',
        description: 'Real-world scenarios to test your decision-making skills in identifying and responding to phishing.'
    },
    'best-practices': {
        title: 'Best Practices',
        description: 'Learn security best practices and how to protect yourself and your organization from email threats.'
    }
};

// DOM Elements
const quizStartButtons = document.querySelectorAll('.quiz-start-btn[data-quiz]');
const modal = document.getElementById('quizAccessModal');
const modalBackdrop = document.querySelector('.quiz-app-modal-backdrop');
const modalCloseBtn = document.querySelector('.quiz-app-modal-close');
const quizAccessTitle = document.getElementById('quizAccessTitle');
const quizAccessDesc = document.getElementById('quizAccessDesc');
const guestContinueBtn = document.getElementById('guestContinueBtn');

let currentQuizId = null;

/**
 * Open the quiz access modal
 */
function openQuizModal(quizId) {
    const quiz = quizzes[quizId];
    if (!quiz) return;

    currentQuizId = quizId;
    quizAccessTitle.textContent = quiz.title;
    quizAccessDesc.textContent = quiz.description;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    
    // Add show class for animation
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
}

/**
 * Close the quiz access modal
 */
function closeQuizModal() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.setAttribute('hidden', '');
        document.body.style.overflow = '';
        currentQuizId = null;
    }, 300);
}

/**
 * Start quiz as guest (simulation)
 */
function startQuizAsGuest() {
    if (!currentQuizId) return;
    closeQuizModal();
    alert(`Starting quiz: "${quizzes[currentQuizId].title}" as guest.\n\nNote: Your progress will not be saved. Sign in to track your progress!`);
}

/**
 * Smooth scroll to section
 */
function smoothScroll(target) {
    if (typeof target === 'string') {
        const elem = document.querySelector(target);
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

/**
 * Event Listeners
 */

// Quiz start buttons
quizStartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const quizId = btn.dataset.quiz;
        
        if (isLoggedIn) {
            // User is logged in - start quiz directly
            alert(`Starting quiz: "${quizzes[quizId].title}"\n\nYour progress will be saved to your account.`);
        } else {
            // User is not logged in - show access modal
            openQuizModal(quizId);
        }
    });
});

// Modal close button
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeQuizModal);
}

// Modal backdrop click
if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeQuizModal);
}

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
        closeQuizModal();
    }
});

// Guest continue button
if (guestContinueBtn) {
    guestContinueBtn.addEventListener('click', startQuizAsGuest);
}

/**
 * Simulate toggling login state (for testing)
 * Uncomment to enable via console: toggleLoginState()
 */
window.toggleLoginState = function() {
    isLoggedIn = !isLoggedIn;
    console.log(`Login state: ${isLoggedIn ? 'LOGGED IN' : 'NOT LOGGED IN'}`);
    
    // Visual feedback
    const banner = document.createElement('div');
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: ${isLoggedIn ? '#1f9d55' : '#dc2626'};
        color: white;
        padding: 12px;
        text-align: center;
        z-index: 999;
        animation: slideDown 0.3s ease-out;
        font-weight: 700;
    `;
    banner.textContent = isLoggedIn ? '✓ Logged In' : '✗ Logged Out';
    document.body.appendChild(banner);
    
    setTimeout(() => banner.remove(), 2000);
};

/**
 * Log instructions to console
 */
console.log('%c🎓 Quiz App - Developer Console', 'font-size: 16px; font-weight: bold; color: #0066cc;');
console.log('%cTip: Type toggleLoginState() to simulate user login/logout', 'font-size: 12px; color: #666;');
