require("dotenv").config({ quiet: true });

const express = require("express");
const http = require("http");
const cors = require("cors");
const initSocket = require("./config/socket");
const { connectDB, getDatabaseStatus } = require("./config/db");
const registerSocketHandlers = require("./socket/socketHandler");
const rooms = require("./store/rooms");

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    database: {
      type: "mongodb",
      configured: Boolean(process.env.MONGO_URI),
      status: getDatabaseStatus(),
    },
    rooms: rooms.size,
    uptime: process.uptime(),
  });
});

app.get("/rooms/public", (_req, res) => {
  const publicRooms = [...rooms.values()]
    .filter((room) => !room.settings.isPrivate && room.game.status === "lobby")
    .map((room) => ({
      id: room.id,
      players: room.players.length,
      maxPlayers: room.settings.maxPlayers,
      rounds: room.settings.rounds,
      drawTime: room.settings.drawTime,
    }));

  res.json(publicRooms);
});

const PORT = process.env.PORT || 5000;

function startServer() {
  registerSocketHandlers(io);
  connectDB();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

module.exports = { app, server, io };
