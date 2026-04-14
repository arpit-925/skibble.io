# Skribbl.io Clone

A production-ready real-time drawing and guessing game built with React, Vite, Node.js, Express, Socket.IO, HTML5 Canvas, and MongoDB score persistence.

## Features

- Create public or private rooms with max players, rounds, draw time, hints, and word category settings.
- Join rooms by code and wait in a lobby until the host starts.
- Turn-based game flow with drawer rotation, word selection, countdown timer, hints, round results, final leaderboard, and winner.
- Real-time canvas sync with `draw_start`, `draw_move`, `draw_end`, `draw_data`, `canvas_clear`, and `draw_undo`.
- Chat and guessing via Socket.IO with case-insensitive validation and speed-based scoring.
- Responsive React UI with Home, Lobby, and Room/Game pages.

## Project Structure

```text
client/
  src/
    components/Canvas.jsx
    components/Toolbar.jsx
    components/Chat.jsx
    components/PlayerList.jsx
    components/Scoreboard.jsx
    pages/Home.jsx
    pages/Lobby.jsx
    pages/Room.jsx
    pages/Game.jsx
    hooks/useSocket.js
    hooks/useCanvas.js
    context/GameContext.jsx
    context/GameContextValue.js
    context/useGame.js
    utils/drawingHelpers.js
server/
  src/
    server.js
    index.js
    socket/socketHandler.js
    models/Room.js
    models/Player.js
    models/Game.js
    controllers/roomController.js
    utils/wordList.js
    utils/scoring.js
    config/db.js
```

## WebSocket Events

Room: `create_room`, `join_room`, `player_joined`, `player_left`, `start_game`

Game: `game_state`, `round_start`, `word_chosen`, `round_end`, `game_over`

Drawing: `draw_start`, `draw_move`, `draw_end`, `draw_data`, `canvas_clear`, `draw_undo`

Chat: `guess`, `guess_result`, `chat`, `chat_message`

## Local Setup

Install dependencies:

```bash
cd server
npm install

cd ../client
npm install
```

Run the backend:

```bash
cd server
npm run dev
```

Run the frontend:

```bash
cd client
npm run dev
```

By default the frontend connects to `http://localhost:5000`. For deployment, set:

```bash
VITE_BACKEND_URL=https://your-backend-url.example
CLIENT_URL=https://your-frontend-url.example
MONGO_URI=mongodb+srv://user:password@cluster.example/skribbl
PORT=5000
```

Current deployed backend URL used before this refactor: `https://skibble-io.onrender.com`.

Frontend URL: set this to your deployed Vite site URL in the hosting dashboard and in `CLIENT_URL` for CORS.

## Production Build

```bash
cd client
npm run build

cd ../server
npm start
```

## Notes

- Room and live game state are kept in memory for low-latency Socket.IO gameplay.
- `server/src/config/db.js` connects with `process.env.MONGO_URI` and stores completed game scores in the `scores` collection.
- If you use MongoDB Atlas, add your backend host's outbound IP address to the Atlas Network Access allowlist.
- The frontend can be deployed to Vercel, Netlify, or any static host. The backend must run on a host that supports persistent WebSocket connections, such as Render, Fly.io, Railway, or a VPS.
