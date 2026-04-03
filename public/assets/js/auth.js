const authTokenKey = 'phish_ai_token';
const authUserKey = 'phish_ai_user';
const activeChatKey = 'phish_ai_active_chat';
const DEPLOY_FRONTEND_ORIGINS = new Set([
    'https://phishnetai.netlify.app',
    'https://pishnetai.vercel.app'
]);
const RENDER_API_BASE = 'https://phishnetai-fb30.onrender.com';

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const resetPasswordForm = document.getElementById('resetPasswordForm');
const authAlert = document.getElementById('authAlert');
const authAlertMsg = document.getElementById('authAlertMsg');
const authSuccess = document.getElementById('authSuccess');
const authSuccessMsg = document.getElementById('authSuccessMsg');
const SIGNUP_NAME_MAX = 48;
const SIGNUP_EMAIL_MAX = 120;
const SIGNUP_PASSWORD_MAX = 64;
const strongPasswordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/;

function getApiBase() {
    const { origin, hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return origin;
    if (DEPLOY_FRONTEND_ORIGINS.has(origin)) return RENDER_API_BASE;
    return origin;
}

function showAlert(message) {
    if (!authAlert || !authAlertMsg) return;
    authAlertMsg.textContent = message;
    authAlert.classList.add('show');
}

function hideAlert() {
    if (!authAlert) return;
    authAlert.classList.remove('show');
}

function showSuccess(message) {
    if (!authSuccess || !authSuccessMsg) return;
    authSuccessMsg.textContent = message;
    authSuccess.classList.add('show');
}

function hideSuccess() {
    if (!authSuccess) return;
    authSuccess.classList.remove('show');
}

async function apiFetch(path, options = {}) {
    const response = await fetch(`${getApiBase()}${path}`, {
        ...options,
        headers: {
            Accept: 'application/json',
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...(options.headers || {})
        }
    });

    const text = await response.text();
    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch (error) {
        data = { ok: false, error: text || 'Unexpected response from server.' };
    }

    if (!response.ok) {
        throw new Error(data.error || 'Request failed.');
    }

    return data;
}

function clearStoredAuth() {
    localStorage.removeItem(authTokenKey);
    localStorage.removeItem(authUserKey);
    localStorage.removeItem(activeChatKey);
    sessionStorage.removeItem(authTokenKey);
    sessionStorage.removeItem(authUserKey);
    sessionStorage.removeItem(activeChatKey);
}

function storeAuth(token, user, rememberMe = true) {
    clearStoredAuth();

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(authTokenKey, token);
    storage.setItem(authUserKey, user?.name || '');
}

function getSafeReturnTo() {
    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get('returnTo') || '';
    const allowedPages = new Set([
        '/assistant',
        '/quiz',
        '/',
        'assistant.html',
        'quiz.html',
        'index.html'
    ]);

    if (allowedPages.has(returnTo)) {
        return returnTo;
    }

    return '/assistant';
}

function wirePasswordToggle(buttonId, inputId, iconId) {
    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!button || !input || !icon) return;

    button.addEventListener('click', () => {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        icon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
    });
}

function wireEnterToNextField(form, fieldIds = []) {
    if (!form || !fieldIds.length) return;

    const fields = fieldIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    fields.forEach((field, index) => {
        field.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter') return;
            if (field.tagName === 'TEXTAREA' && event.shiftKey) return;

            event.preventDefault();

            const nextField = fields[index + 1];
            if (nextField) {
                nextField.focus();
                if (typeof nextField.select === 'function' && nextField.tagName === 'INPUT') {
                    nextField.select();
                }
                return;
            }

            form.requestSubmit();
        });
    });
}

function validateSignupPayload({ name, email, password }) {
    const trimmedName = String(name || '').trim();
    const trimmedEmail = String(email || '').trim();
    const rawPassword = String(password || '');

    if (trimmedName.length < 2) {
        return 'Please enter your full name.';
    }

    if (trimmedName.length > SIGNUP_NAME_MAX) {
        return `Full name must stay within ${SIGNUP_NAME_MAX} characters.`;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
        return 'Please enter a valid email address.';
    }

    if (trimmedEmail.length > SIGNUP_EMAIL_MAX) {
        return `Email must stay within ${SIGNUP_EMAIL_MAX} characters.`;
    }

    if (!strongPasswordRule.test(rawPassword)) {
        return 'Password must be 8 to 64 characters and include uppercase, lowercase, number, and special character.';
    }

    return '';
}

if (loginForm) {
    hideAlert();
    wirePasswordToggle('togglePw', 'loginPassword', 'togglePwIcon');
    wireEnterToNextField(loginForm, ['loginEmail', 'loginPassword']);

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideAlert();

        const email = document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('loginPassword')?.value || '';
        const rememberMe = Boolean(loginForm.querySelector('input[type="checkbox"]')?.checked);

        try {
            const data = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            storeAuth(data.token, data.user, rememberMe);
            window.location.href = getSafeReturnTo();
        } catch (error) {
            showAlert(error.message || 'Could not sign in.');
        }
    });
}

if (forgotPasswordForm || resetPasswordForm) {
    hideAlert();
    hideSuccess();
    wirePasswordToggle('toggleResetPw', 'resetPassword', 'toggleResetPwIcon');
    wirePasswordToggle('toggleResetConfirmPw', 'resetConfirmPassword', 'toggleResetConfirmPwIcon');

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || '';
    const resetIntro = document.getElementById('resetIntro');
    const resetLinkPreview = document.getElementById('resetLinkPreview');
    const resetLinkAnchor = document.getElementById('resetLinkAnchor');
    const resetLinkText = document.getElementById('resetLinkText');
    const copyResetLinkBtn = document.getElementById('copyResetLinkBtn');
    const resetTokenInput = document.getElementById('resetToken');

    if (token && resetPasswordForm && forgotPasswordForm) {
        forgotPasswordForm.hidden = true;
        resetPasswordForm.hidden = false;
        if (resetIntro) {
            resetIntro.textContent = 'Enter your new password below to finish resetting your account.';
        }
        if (resetTokenInput) {
            resetTokenInput.value = token;
        }
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            hideAlert();
            hideSuccess();

            const email = document.getElementById('forgotEmail')?.value.trim();

            try {
                const data = await apiFetch('/api/auth/forgot-password', {
                    method: 'POST',
                    body: JSON.stringify({ email })
                });

                showSuccess(data.message || 'Reset instructions are ready.');

                if (data.resetUrl && resetLinkPreview && resetLinkAnchor) {
                    resetLinkPreview.hidden = false;
                    resetLinkAnchor.href = data.resetUrl;
                    if (resetLinkText) {
                        resetLinkText.textContent = 'Use the button below to open the reset page, or copy the link for testing on another tab or device.';
                    }
                    if (copyResetLinkBtn) {
                        copyResetLinkBtn.dataset.url = data.resetUrl;
                        copyResetLinkBtn.textContent = 'Copy link';
                    }
                }
            } catch (error) {
                showAlert(error.message || 'Could not prepare a reset link.');
            }
        });
    }

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            hideAlert();
            hideSuccess();

            const tokenValue = document.getElementById('resetToken')?.value.trim();
            const password = document.getElementById('resetPassword')?.value || '';
            const confirmPassword = document.getElementById('resetConfirmPassword')?.value || '';

            if (!tokenValue) {
                showAlert('Missing reset token. Please open a valid reset link.');
                return;
            }

            if (password !== confirmPassword) {
                showAlert('Passwords do not match.');
                return;
            }

            try {
                const data = await apiFetch('/api/auth/reset-password', {
                    method: 'POST',
                    body: JSON.stringify({ token: tokenValue, password })
                });

                showSuccess(data.message || 'Password updated successfully.');
                resetPasswordForm.reset();
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1200);
            } catch (error) {
                showAlert(error.message || 'Could not reset password.');
            }
        });
    }

    if (copyResetLinkBtn) {
        copyResetLinkBtn.addEventListener('click', async () => {
            const resetUrl = copyResetLinkBtn.dataset.url || '';
            if (!resetUrl) return;

            try {
                await navigator.clipboard.writeText(resetUrl);
                copyResetLinkBtn.textContent = 'Copied';
                setTimeout(() => {
                    copyResetLinkBtn.textContent = 'Copy link';
                }, 1400);
            } catch (error) {
                showAlert('Could not copy the reset link. Please open it directly instead.');
            }
        });
    }
}

if (signupForm) {
    hideAlert();
    wirePasswordToggle('toggleSignupPw', 'signupPassword', 'toggleSignupPwIcon');
    wirePasswordToggle('toggleConfirmPw', 'signupConfirmPassword', 'toggleConfirmPwIcon');
    wireEnterToNextField(signupForm, ['signupName', 'signupEmail', 'signupPassword', 'signupConfirmPassword']);

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideAlert();

        const name = document.getElementById('signupName')?.value.trim();
        const email = document.getElementById('signupEmail')?.value.trim();
        const password = document.getElementById('signupPassword')?.value || '';
        const confirmPassword = document.getElementById('signupConfirmPassword')?.value || '';
        const acceptedTerms = document.getElementById('signupTerms')?.checked;

        const signupError = validateSignupPayload({ name, email, password });
        if (signupError) {
            showAlert(signupError);
            return;
        }

        if (password !== confirmPassword) {
            showAlert('Passwords do not match.');
            return;
        }

        if (!acceptedTerms) {
            showAlert('Please agree to the Terms & Conditions first.');
            return;
        }

        try {
            const data = await apiFetch('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });

            storeAuth(data.token, data.user, true);
            window.location.href = getSafeReturnTo();
        } catch (error) {
            showAlert(error.message || 'Could not create account.');
        }
    });
}
