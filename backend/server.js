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

app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "skribbl-backend",
    rooms: rooms.size,
    wordCategories: listCategories(),
    frontendUrl: CLIENT_URL,
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

app.get("/rooms/public", (_request, response) => {
  const publicRooms = [...rooms.values()]
    .filter((room) => !room.settings.isPrivate && room.game.status === "lobby")
    .map((room) => ({
      id: room.id,
      players: room.players.length,
      maxPlayers: room.settings.maxPlayers,
      rounds: room.settings.rounds,
      drawTime: room.settings.drawTime,
      category: room.settings.category,
    }));

  response.json(publicRooms);
});

initializeSocket(server, { clientUrl: CLIENT_URL });

server.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  console.log(`Allowed frontend origin: ${CLIENT_URL}`);
});
