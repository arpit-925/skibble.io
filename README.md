# Skribbl.io Clone

Real-time multiplayer drawing and guessing game built with React, Vite, Express, and Socket.IO.

## What It Does

- Creates public or private rooms with shareable room codes
- Lets the host configure rounds, draw time, hints, max players, category, and number of word choices
- Rotates the drawer each turn and gives the drawer a fresh word selection
- Syncs drawing events live across the room
- Handles chat, guesses, scoring, round results, and final winner state
- Exposes simple REST endpoints for health checks, categories, and public-room discovery

## Tech Stack

- Frontend: React 19, Vite, React Router, Socket.IO client
- Backend: Node.js, Express 5, Socket.IO
- Styling: CSS with Tailwind tooling available in the repo

## Repo Layout

```text
backend/
  models/
  socket/
  utils/
  server.js

client/
  src/
    components/
    context/
    hooks/
    pages/
    socket/
    utils/
  public/
```

## Prerequisites

- Node.js 18+
- npm

## Install

Install dependencies for each app:

```bash
cd backend
npm install

cd ../client
npm install
```

## Run Locally

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

Open the frontend URL shown by Vite, usually `http://localhost:5173`.

## Environment Variables

### Backend

Create `backend/.env` if you want to override defaults:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Frontend

Create `client/.env` for local backend development:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Without `VITE_BACKEND_URL`, the client falls back to the deployed backend URL in [client/src/socket/socket.js](/d:/skribbl.io/client/src/socket/socket.js:1).

## Available Scripts

### Backend

- `npm run dev` starts the server with `nodemon`
- `npm start` starts the production server

### Frontend

- `npm run dev` starts the Vite dev server
- `npm run build` creates a production build
- `npm run preview` previews the built app
- `npm run lint` runs ESLint

## HTTP Endpoints

- `GET /` basic backend status text
- `GET /health` JSON health payload
- `GET /rooms/public` public lobby list
- `GET /words/categories` available drawing categories

## Socket Events

### Room Flow

- `create_room`
- `join_room`
- `player_joined`
- `player_left`
- `start_game`
- `game_state`

### Round Flow

- `round_start`
- `word_chosen`
- `round_end`
- `game_over`

### Drawing Flow

- `draw_start`
- `draw_move`
- `draw_end`
- `draw_data`
- `canvas_clear`
- `draw_undo`

### Chat / Guessing

- `guess`
- `guess_result`
- `chat_message`

## Notes

- Room and game state are stored in memory on the backend.
- Players cannot join a room after the game has already started.
- Word categories currently come from the static word bank in [backend/utils/words.js](/d:/skribbl.io/backend/utils/words.js:1).
- The frontend includes UI fields for language and word mode, but the backend game flow currently uses category, hints, rounds, draw time, max players, privacy, and word choices.

## Recent Fixes

- Fixed backend room settings so `wordChoices` now respects the value selected in the UI instead of always forcing `3`.
- Fixed drawing state so a completed stroke is stored as one full path on the server, which keeps undo behavior aligned with the client-side canvas model.
