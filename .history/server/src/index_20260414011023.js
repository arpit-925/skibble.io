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

// sample words (you can later use MongoDB)
const words = ["apple", "car", "dog", "house", "tree"];

function getRandomWords(count = 3) {
  return words.sort(() => 0.5 - Math.random()).slice(0, count);
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // JOIN ROOM
  socket.on("join_room", ({ roomId, name }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        host: socket.id,
        game: {
          round: 1,
          turn: 0,
          word: "",
          started: false,
        },
      };
    }

    const room = rooms[roomId];

    const player = {
      id: socket.id,
      name,
      score: 0,
      guessed: false,
    };

    room.players.push(player);

    socket.join(roomId);

    io.to(roomId).emit("player_list", {
      players: room.players,
      host: room.host,
    });
  });

  // START GAME
  socket.on("start_game", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;

    room.game.started = true;
    startRound(roomId);
  });

  function startRound(roomId) {
    const room = rooms[roomId];

    // reset guesses
    room.players.forEach((p) => (p.guessed = false));

    const drawer = room.players[room.game.turn];

    const options = getRandomWords();

    // send word options only to drawer
    io.to(drawer.id).emit("word_options", options);

    io.to(roomId).emit("round_start", {
      drawerId: drawer.id,
      round: room.game.round,
    });
  }

  // WORD CHOSEN
  socket.on("word_chosen", ({ roomId, word }) => {
    const room = rooms[roomId];
    if (!room) return;

    room.game.word = word;

    io.to(roomId).emit("word_length", word.length);
  });

  // DRAW
  socket.on("draw", ({ roomId, x, y, color, size }) => {
    socket.to(roomId).emit("draw", { x, y, color, size });
  });

  // CHAT / GUESS
  socket.on("chat", ({ roomId, text }) => {
    const room = rooms[roomId];
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);

    // normalize
    const guess = text.trim().toLowerCase();
    const actual = room.game.word.toLowerCase();

    if (guess === actual && !player.guessed) {
      player.guessed = true;
      player.score += 10;

      io.to(roomId).emit("guess_result", {
        correct: true,
        playerName: player.name,
        points: 10,
      });

      // check if all guessed
      const allGuessed = room.players
        .filter(p => p.id !== room.players[room.game.turn].id)
        .every(p => p.guessed);

      if (allGuessed) nextTurn(roomId);
    } else {
      io.to(roomId).emit("chat_message", {
        text,
        playerName: player.name,
      });
    }
  });

  function nextTurn(roomId) {
    const room = rooms[roomId];

    room.game.turn =
      (room.game.turn + 1) % room.players.length;

    room.game.round++;

    io.to(roomId).emit("round_end", {
      scores: room.players,
    });

    setTimeout(() => startRound(roomId), 2000);
  }

  // CLEAR
  socket.on("canvas_clear", ({ roomId }) => {
    io.to(roomId).emit("canvas_clear");
  });
  socket.on("draw", ({ roomId, x, y, color, size }) => {
  socket.to(roomId).emit("draw", { x, y, color, size });
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