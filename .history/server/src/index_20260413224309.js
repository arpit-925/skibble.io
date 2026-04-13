const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const rooms = require("./store/rooms");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// 🔥 Utility
function getRoom(roomId) {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      players: [],
      host: null,
    };
  }
  return rooms[roomId];
}

// 🔌 SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 🧑‍🤝‍🧑 JOIN ROOM
  socket.on("join_room", ({ roomId, name }) => {
    const room = getRoom(roomId);

    const player = {
      id: socket.id,
      name,
      score: 0,
    };

    room.players.push(player);

    if (!room.host) {
      room.host = socket.id;
    }

    socket.join(roomId);

    // broadcast updated players
    io.to(roomId).emit("player_list", {
      players: room.players,
      host: room.host,
    });

    console.log(`${name} joined ${roomId}`);
  });

  // 🎮 START GAME
  socket.on("start_game", ({ roomId }) => {
    io.to(roomId).emit("game_start", {
      message: "Game started!",
    });
  });

  // 🎨 DRAW
  socket.on("draw", ({ roomId, x, y, color, size }) => {
    socket.to(roomId).emit("draw", { x, y, color, size });
  });

  // 🧹 CLEAR CANVAS
  socket.on("canvas_clear", ({ roomId }) => {
    io.to(roomId).emit("canvas_clear");
  });

  // 💬 CHAT
  socket.on("chat", ({ roomId, text }) => {
    io.to(roomId).emit("chat_message", {
      text,
      sender: socket.id,
    });
  });

  // ❌ DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const roomId in rooms) {
      const room = rooms[roomId];

      room.players = room.players.filter(
        (p) => p.id !== socket.id
      );

      // update host if needed
      if (room.host === socket.id) {
        room.host = room.players[0]?.id || null;
      }

      // update room
      io.to(roomId).emit("player_list", {
        players: room.players,
        host: room.host,
      });

      // delete empty room
      if (room.players.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

// 🚀 START SERVER
server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});