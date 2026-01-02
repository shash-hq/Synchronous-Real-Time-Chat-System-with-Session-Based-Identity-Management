const loginBtn = document.getElementById('login-btn');
const usernameInput = document.getElementById('username-input');
const messages = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const userCountSpan = document.getElementById('user-count');
const logoutBtn = document.getElementById('logout-btn');

let socket;

// If currentUser is set (rendered by EJS), initialize chat
if (currentUser) {
    initializeChat();
} else {
    // We are on login screen
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') login();
        });
    }
}

function login() {
    const username = usernameInput.value.trim();
    if (!username) return alert('Please enter a username');

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Reload the page so the server renders the Chat view
                window.location.reload();
            } else {
                alert('Login failed');
            }
        });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        fetch('/logout', { method: 'POST' })
            .then(() => window.location.reload());
    });
}

function initializeChat() {
    socket = io();

    socket.on('connect', () => {
        console.log('Connected to server as ' + currentUser);
    });

    socket.on('message', (msg) => {
        appendMessage(msg);
    });

    socket.on('userCount', (count) => {
        if (userCountSpan) userCountSpan.innerText = `Active Users: ${count}`;
    });

    socket.on('auth_error', (err) => {
        alert(err.message);
        window.location.reload();
    });

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = chatInput.value.trim();
            if (msg) {
                socket.emit('chatMessage', msg);
                chatInput.value = '';
            }
        });
    }
}

function appendMessage(msg) {
    if (!messages) return;

    const li = document.createElement('li');
    li.classList.add('message');

    if (msg.type === 'system') {
        li.classList.add('system');
        li.textContent = msg.text;
    } else {
        li.classList.add('user');
        if (msg.username === currentUser) {
            li.classList.add('self');
        }

        const meta = document.createElement('span');
        meta.classList.add('meta');
        meta.textContent = msg.username;

        const text = document.createTextNode(msg.text);

        if (msg.username !== currentUser) li.appendChild(meta);
        li.appendChild(text);
    }

    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
}
