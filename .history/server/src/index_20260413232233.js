const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // JOIN ROOM
  socket.on("join_room", ({ roomId, name }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        host: socket.id,
      };
    }

    const room = rooms[roomId];

    const player = {
      id: socket.id,
      name,
      score: 0,
    };

    room.players.push(player);

    socket.join(roomId);

    io.to(roomId).emit("player_list", {
      players: room.players,
      host: room.host,
    });
  });

  // DRAW
  socket.on("draw", ({ roomId, x, y, color, size }) => {
    socket.to(roomId).emit("draw", { x, y, color, size });
  });

  // CLEAR
  socket.on("canvas_clear", ({ roomId }) => {
    io.to(roomId).emit("canvas_clear");
  });

  // CHAT
  socket.on("chat", ({ roomId, text }) => {
    io.to(roomId).emit("chat_message", { text });
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];

      room.players = room.players.filter(
        (p) => p.id !== socket.id
      );

      io.to(roomId).emit("player_list", {
        players: room.players,
        host: room.host,
      });
    }
  });
});

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});