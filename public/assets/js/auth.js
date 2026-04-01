const authTokenKey = 'phish_ai_token';
const authUserKey = 'phish_ai_user';
const NETLIFY_FRONTEND_ORIGIN = 'https://phishnetai.netlify.app';
const RENDER_API_BASE = 'https://phishnetai-fb30.onrender.com';

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const authAlert = document.getElementById('authAlert');
const authAlertMsg = document.getElementById('authAlertMsg');

function getApiBase() {
    const { origin, hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return origin;
    if (origin === NETLIFY_FRONTEND_ORIGIN) return RENDER_API_BASE;
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

function storeAuth(token, user) {
    localStorage.setItem(authTokenKey, token);
    localStorage.setItem(authUserKey, user?.name || '');
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

if (loginForm) {
    hideAlert();
    wirePasswordToggle('togglePw', 'loginPassword', 'togglePwIcon');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideAlert();

        const email = document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('loginPassword')?.value || '';

        try {
            const data = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            storeAuth(data.token, data.user);
            window.location.href = 'assistant.html';
        } catch (error) {
            showAlert(error.message || 'Could not sign in.');
        }
    });
}

if (signupForm) {
    hideAlert();
    wirePasswordToggle('toggleSignupPw', 'signupPassword', 'toggleSignupPwIcon');
    wirePasswordToggle('toggleConfirmPw', 'signupConfirmPassword', 'toggleConfirmPwIcon');

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideAlert();

        const name = document.getElementById('signupName')?.value.trim();
        const email = document.getElementById('signupEmail')?.value.trim();
        const password = document.getElementById('signupPassword')?.value || '';
        const confirmPassword = document.getElementById('signupConfirmPassword')?.value || '';
        const acceptedTerms = document.getElementById('signupTerms')?.checked;

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

            storeAuth(data.token, data.user);
            window.location.href = 'assistant.html';
        } catch (error) {
            showAlert(error.message || 'Could not create account.');
        }
    });
}
