# Synchronous Real-Time Chat System
A lightweight, real-time messaging application built with Node.js, Express, and Socket.io. This system demonstrates seamless integration between server-side HTTP sessions and WebSocket connections to maintain user identity persistence.
## 🚀 Features
- **Real-Time Communication**: Instant bi-directional messaging using Socket.io.
- **Session-Based Identity**: Users identify themselves via a username, which is stored in a server-side session.
- **Unified Authentication**: The `express-session` middleware is shared with Socket.io, ensuring that the WebSocket handshake inherits the authenticated user state.
- **Active User Tracking**: Real-time counter of connected users updates instantly across all clients.
- **Identity Persistence**: Refreshing the browser does not lose the user's session or identity.
## 🛠 Tech Stack
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Real-Time Engine**: [Socket.io](https://socket.io/)
- **Session Management**: [express-session](https://www.npmjs.com/package/express-session)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
## 📦 Installation
1.  **Clone the repository**
    ```bash
    git clone https://github.com/shash-hq/Synchronous-Real-Time-Chat-System-with-Session-Based-Identity-Management.git
    cd Synchronous-Real-Time-Chat-System-with-Session-Based-Identity-Management
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Start the server**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:3000`.
## 🧪 Interpretation & Usage
1.  **Log In**: Open `http://localhost:3000`. You will be prompted to enter a username.
2.  **Chat**: Once logged in, you enter the chat room. Type messages and hit enter to send.
3.  **Multi-User Testing**:
    - Open a new tab in **Incognito Mode** or use a **different browser**.
    - Log in with a different username.
    - Observe the "Active Users" count update in real-time.
    - Send messages back and forth to see instant delivery.
4.  **Logout**: Click the "Logout" button in the header to end your session.
## 📂 Project Structure
```
├── public/
│   └── index.html      # Frontend UI (Login & Chat)
├── server.js           # Main application server (Express + Socket.io + Session config)
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

```
## 📄 License
This project is open source and available under the [MIT License](LICENSE).
