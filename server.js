const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 1. Configure express-session middleware
const sessionMiddleware = session({
    secret: 'secret-key-replace-in-prod', // In a real app, use a secure env variable
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if serving over HTTPS
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Middleware Integration
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

// 3. Share session middleware with Socket.io
// This allows specific socket connections to access the session via socket.request.session
io.engine.use(sessionMiddleware);

// 4. Routes
app.get('/', (req, res) => {
    // Server-Side Rendering: Pass session data to the view
    res.render('index', {
        username: req.session.username || null
    });
});


app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username && username.trim()) {
        req.session.username = username.trim();
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ error: "Failed to save session" });
            }
            res.json({ success: true });
        });
    } else {
        res.status(400).json({ error: "Username is required" });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Could not log out" });
        res.json({ success: true });
    });
});

// 5. Socket Logic
io.on('connection', (socket) => {
    // Access the session from the handshake request
    const session = socket.request.session;

    // Check if user is authenticated (has a username in session)
    if (session && session.username) {
        const username = session.username;
        console.log(`User connected: ${username} (Socket ID: ${socket.id})`);

        // Join session-specific room if needed, or just track locally
        // Welcome the user
        socket.emit('message', {
            type: 'system',
            text: `Welcome to the chat, ${username}!`
        });

        // Broadcast that a user joined (optional, but good for chat context)
        socket.broadcast.emit('message', {
            type: 'system',
            text: `${username} has joined the chat.`
        });

        // Emit updated user count to ALL clients
        io.emit('userCount', io.engine.clientsCount);

        // Handle incoming chat messages
        socket.on('chatMessage', (msg) => {
            // Broadcast the message to everyone (including sender, or use broadcast to exclude)
            // Requirement: "Messages sent by one user must be broadcast instantly to all connected clients."
            io.emit('message', {
                type: 'user',
                username: username,
                text: msg,
                timestamp: new Date().toISOString()
            });
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${username}`);
            io.emit('userCount', io.engine.clientsCount);
            // Optional: Broadcast leave message
            // io.emit('message', { type: 'system', text: `${username} left.` });
        });

    } else {
        console.log('Unauthenticated socket connection attempted.');
        // Ideally we might disconnect them, but for this simple app we can just not attach listeners
        // or emit an error.
        socket.emit('auth_error', { message: 'Not authenticated' });
        socket.disconnect(true);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
