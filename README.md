# 🎨 Skribbl.io Clone (Multiplayer Drawing Game)

## 🚀 Overview

This project is a full-stack **multiplayer drawing and guessing game** inspired by skribbl.io.
Players join a room, take turns drawing, and others guess the word in real time.

---

## ✨ Features

### ✅ Core Features

* 🧑‍🤝‍🧑 Create & Join Rooms
* 🎮 Turn-based Gameplay
* 🎨 Real-time Drawing (Canvas)
* 💬 Chat & Guess System
* 🏆 Score Tracking (basic)
* 🔄 Live Updates via WebSockets

### ⭐ Bonus Features

* 🎨 Drawing Toolbar (colors, brush size, clear)
* 🧠 Word selection from database (MongoDB)
* ⚡ Optimized socket handling using custom hooks
* 🧱 Modular backend architecture (OOP + handlers)

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO

### Database

* MongoDB (for words & scores)

---

## 🧠 Architecture

The application is divided into:

* **Frontend** → UI, Canvas, Chat, Game Screens
* **Backend** → Game logic, Rooms, Players
* **WebSockets** → Real-time communication

### 🔌 Real-time Flow

1. User draws → sends coordinates via socket
2. Server broadcasts → other users render
3. Guess sent → validated on server
4. Score updated → broadcast to all

---

## 📁 Project Structure

```
skribbl-clone/
├── client/      # React frontend
├── server/      # Node backend
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone <your-repo-link>
cd skribbl-clone
```

---

### 2️⃣ Setup Backend

```
cd server
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_uri
PORT=5000
```

Run server:

```
npm run dev
```

---

### 3️⃣ Setup Frontend

```
cd client
npm install
npm run dev
```

---

## 🌐 Usage

1. Open frontend in browser
2. Enter name & room ID
3. Join room with friends
4. Start game (host)
5. Draw and guess 🎨

---

## 📡 WebSocket Events

### Room

* `join_room`
* `player_list`

### Game

* `start_game`
* `game_start`

### Drawing

* `draw`
* `canvas_clear`

### Chat

* `chat`
* `chat_message`

---

## 🧠 Key Design Decisions

* Used **Socket.IO** for real-time communication
* Maintained **game state in memory** for performance
* Used **MongoDB only for persistent data (words, scores)**
* Modularized backend using **models + handlers**

---

## ⚡ Challenges Faced

* Real-time drawing synchronization
* Managing multiple players in rooms
* Avoiding duplicate socket listeners
* Handling disconnections properly

---

## 🚀 Future Improvements

* ⏱ Timer & rounds system
* 🏆 Leaderboard (persistent)
* 🌍 Word categories
* 🔐 Authentication system
* 📱 Mobile responsiveness

---

## 👨‍💻 Author

**Arpit Mishra**

---

## 📌 Notes

* This project was built as part of an internship assignment
* Focus was on **real-time system design and scalability**

---
