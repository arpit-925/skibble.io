require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { initializeSocket, rooms } = require("./socket");
const { listCategories } = require("./utils/words");

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "https://skibble-io.vercel.app";
const PORT = Number(process.env.PORT) || 5000;

// ✅ Improved CORS
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        CLIENT_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Skribbl Backend Running 🚀");
});

// ✅ Health check
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "skribbl-backend",
    rooms: rooms.size,
    wordCategories: listCategories(),
    frontendUrl: CLIENT_URL,
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

// ✅ Public rooms endpoint (fixed crash issue)
app.get("/rooms/public", (_req, res) => {
  const publicRooms = [...rooms.values()]
    .filter(
      (room) =>
        !room.settings.isPrivate &&
        room.game &&
        room.game.status === "lobby",
    )
    .map((room) => ({
      id: room.id,
      players: room.players.length,
      maxPlayers: room.settings.maxPlayers,
      rounds: room.settings.rounds,
      drawTime: room.settings.drawTime,
      category: room.settings.category,
    }));

  res.json(publicRooms);
});

app.get("/words/categories", (_req, res) => {
  res.json(listCategories());
});

// ✅ Socket init
initializeSocket(server, { clientUrl: CLIENT_URL });

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`🌐 Allowed frontend: ${CLIENT_URL}`);
});
