const authTokenKey = 'phish_ai_token';
const authUserKey = 'phish_ai_user';
const quizAttemptsKey = 'phish_ai_quiz_attempts';

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
                    'A teacher reminding you about tomorrow’s class.',
                    'A campus office asking you to confirm your password by email.',
                    'A classmate sending project updates.',
                    'A school department posting office hours.'
                ],
                answer: 1,
                explanation: 'Legitimate organizations should not ask for passwords through email or chat.'
            },
            {
                topic: 'Attachments',
                prompt: 'You get an unexpected attachment labeled “account-update-form.” What is the safest next step?',
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
                prompt: 'A student receives a “tuition balance” email with a payment link and urgent warning. What is the safest reaction?',
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
                prompt: 'A chat message from a “school officer” asks for a one-time code sent to your phone. What is the safest response?',
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

let currentQuizId = null;
let currentQuestionIndex = 0;
let selectedAnswerIndex = null;
let score = 0;
let answers = [];

if (quizHeroPanel) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            quizHeroPanel.classList.add('is-animated');
        }, 80);
    });
}

function getStoredAuthToken() {
    return localStorage.getItem(authTokenKey) || sessionStorage.getItem(authTokenKey) || '';
}

function getStoredUser() {
    const rawUser = localStorage.getItem(authUserKey) || sessionStorage.getItem(authUserKey);
    if (!rawUser) return null;

    try {
        return JSON.parse(rawUser);
    } catch {
        return null;
    }
}

function isLoggedIn() {
    return Boolean(getStoredAuthToken());
}

function getAttemptStorage() {
    return localStorage;
}

function saveSignedInAttempt(result) {
    if (!isLoggedIn()) return;

    const user = getStoredUser();
    const userKey = user?.email || user?.username || user?.name || 'signed-in-user';
    const storage = getAttemptStorage();

    let allAttempts = {};
    try {
        allAttempts = JSON.parse(storage.getItem(quizAttemptsKey) || '{}');
    } catch {
        allAttempts = {};
    }

    const userAttempts = allAttempts[userKey] || [];
    userAttempts.unshift({
        ...result,
        completedAt: new Date().toISOString()
    });

    allAttempts[userKey] = userAttempts.slice(0, 20);
    storage.setItem(quizAttemptsKey, JSON.stringify(allAttempts));
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

function updateWorkspaceVisibility(showResults = false) {
    if (!quizWorkspace) return;
    quizWorkspace.hidden = false;
    quizQuestionCard.hidden = showResults;
    quizResultCard.hidden = !showResults;
}

function scrollToWorkspace() {
    quizWorkspace?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderQuestion() {
    const quiz = quizzes[currentQuizId];
    const question = quiz?.questions[currentQuestionIndex];
    if (!quiz || !question) return;

    selectedAnswerIndex = null;
    quizSessionTitle.textContent = quiz.title;
    quizSessionDesc.textContent = quiz.description;
    quizQuestionTopic.textContent = `${quiz.title} • ${question.topic}`;
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

    if (isLoggedIn()) {
        guestQuizPrompt.hidden = true;
        saveSignedInAttempt({
            quizId: currentQuizId,
            quizTitle: quiz.title,
            score,
            totalQuestions,
            percentage
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

    renderQuestion();
    scrollToWorkspace();
}

function resetQuizWorkspace() {
    currentQuizId = null;
    currentQuestionIndex = 0;
    selectedAnswerIndex = null;
    score = 0;
    answers = [];

    if (quizWorkspace) quizWorkspace.hidden = true;
    if (quizFeedback) {
        quizFeedback.hidden = true;
        quizFeedback.innerHTML = '';
    }
}

quizStartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
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
