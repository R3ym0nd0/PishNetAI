const storageKey = 'phish_ai_chat';
const userKey = 'phish_ai_user';

const aiMessagesFull = document.getElementById('aiMessagesFull');
const aiFormFull = document.getElementById('aiFormFull');
const aiInputFull = document.getElementById('aiInputFull');
const loginPanel = document.getElementById('loginPanel');
const showLogin = document.getElementById('showLogin');
const doLogin = document.getElementById('doLogin');
const usernameField = document.getElementById('username');
const userDisplay = document.getElementById('userDisplay');

function loadHistory() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
        const messages = JSON.parse(raw);
        messages.forEach(m => appendMessageFull(m.text, m.who));
    } catch(e) { console.warn('failed to parse history', e); }
}

function saveMessage(text, who) {
    const raw = localStorage.getItem(storageKey);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push({ text, who, at: Date.now() });
    localStorage.setItem(storageKey, JSON.stringify(arr.slice(-200)));
}

function appendMessageFull(text, who='bot'){
    const el = document.createElement('div');
    el.className = `ai-msg ${who}`;
    el.textContent = text;
    aiMessagesFull.appendChild(el);
    aiMessagesFull.scrollTop = aiMessagesFull.scrollHeight;
}

aiFormFull.addEventListener('submit', (e)=>{
    e.preventDefault();
    const v = aiInputFull.value.trim();
    if (!v) return;
    appendMessageFull(v,'user'); saveMessage(v,'user'); aiInputFull.value='';
    setTimeout(()=>{
        const reply = 'Demo full assistant: check domain spelling, TLS, odd subdomains, and urgent wording.';
        appendMessageFull(reply,'bot'); saveMessage(reply,'bot');
    }, 700);
});

function updateUserUI(){
    const name = localStorage.getItem(userKey);
    if (name) userDisplay.textContent = `Signed in as ${name}`;
    else userDisplay.textContent = 'Not signed in';
}

showLogin.addEventListener('click', ()=>{
    loginPanel.classList.toggle('show');
});

doLogin.addEventListener('click', ()=>{
    const v = usernameField.value.trim();
    if (!v) return alert('Enter a name');
    localStorage.setItem(userKey, v);
    loginPanel.classList.remove('show');
    updateUserUI();
});

updateUserUI(); loadHistory();
