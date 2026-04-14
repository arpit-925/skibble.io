const Room = require("../models/Room");
const { saveGameScores } = require("../config/db");
const rooms = require("../store/rooms");

function createRoomCode() {
  let code = "";
  do {
    code = Math.random().toString(36).slice(2, 8).toUpperCase();
  } while (rooms.has(code));
  return code;
}

function emitRoomState(io, room) {
  room.players.forEach((player) => {
    io.to(player.id).emit("game_state", room.serializeFor(player.id));
  });
}

async function endRound(io, room, reason) {
  const result = room.game.finishRound(reason);
  room.broadcast("round_end", result);
  emitRoomState(io, room);

  setTimeout(() => {
    room.game.nextTurn()
      .then((next) => handleRoundTransition(io, room, next))
      .catch((error) => {
        console.error("Failed to move to the next turn:", error.message);
      });
  }, 3500);
}

function startDrawingTimer(io, room) {
  room.game.startTimer(
    () => emitRoomState(io, room),
    () => emitRoomState(io, room),
    (reason) => {
      endRound(io, room, reason).catch((error) => {
        console.error("Failed to end timed round:", error.message);
      });
    },
  );
}

async function handleRoundTransition(io, room, transition) {
  if (!transition) return;

  if (transition.type === "game_over") {
    const players = room.serializePlayers().sort((a, b) => b.score - a.score);
    saveGameScores(room.id, players).catch((error) => {
      console.error("Failed to save game scores:", error.message);
    });
    room.broadcast("game_over", {
      players,
      winner: players[0] || null,
    });
    emitRoomState(io, room);
    return;
  }

  if (transition.type === "waiting") {
    emitRoomState(io, room);
    return;
  }

  if (transition.type === "round_start") {
    room.broadcast("canvas_clear");
    room.broadcast("round_start", {
      round: room.game.round,
      totalRounds: room.settings.rounds,
      drawerId: transition.drawer.id,
      drawerName: transition.drawer.name,
      timeLeft: room.game.timeLeft,
      maskedWord: "",
    });
    emitRoomState(io, room);
  }
}

function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    socket.on("create_room", ({ name, settings } = {}, ack) => {
      const roomId = createRoomCode();
      const room = new Room({
        id: roomId,
        host: { id: socket.id, name },
        settings,
        io,
      });

      rooms.set(roomId, room);
      socket.join(roomId);
      socket.emit("player_joined", { roomId, player: room.getPlayer(socket.id).serialize(), players: room.serializePlayers() });
      emitRoomState(io, room);
      if (typeof ack === "function") ack({ ok: true, roomId, room: room.serializeFor(socket.id) });
    });

    socket.on("join_room", ({ roomId, name } = {}, ack) => {
      const code = String(roomId || "").trim().toUpperCase();
      const room = rooms.get(code);
      if (!room) {
        const error = "Room not found.";
        socket.emit("room_error", { error });
        if (typeof ack === "function") ack({ ok: false, error });
        return;
      }

      const result = room.addPlayer({ id: socket.id, name });
      if (!result.ok) {
        socket.emit("room_error", { error: result.error });
        if (typeof ack === "function") ack({ ok: false, error: result.error });
        return;
      }

      socket.join(code);
      room.broadcast("player_joined", {
        roomId: code,
        player: result.player.serialize(),
        players: room.serializePlayers(),
      });
      emitRoomState(io, room);
      if (typeof ack === "function") ack({ ok: true, roomId: code, room: room.serializeFor(socket.id) });
    });

    socket.on("start_game", async ({ roomId } = {}) => {
      const room = rooms.get(String(roomId || "").toUpperCase());
      if (!room || !room.isHost(socket.id) || room.players.length < 2) return;
      const transition = await room.game.start();
      await handleRoundTransition(io, room, transition);
    });

    socket.on("word_chosen", ({ roomId, word } = {}) => {
      const room = rooms.get(String(roomId || "").toUpperCase());
      if (!room || !room.game.chooseWord(socket.id, word)) return;

      room.broadcast("word_chosen", {
        drawerId: socket.id,
        drawerName: room.getPlayer(socket.id)?.name,
        maskedWord: room.game.getMaskedWord(),
        hint: room.game.getHint(),
        timeLeft: room.game.timeLeft,
      });
      room.broadcast("canvas_clear");
      emitRoomState(io, room);
      startDrawingTimer(io, room);
    });

    socket.on("guess", ({ roomId, text } = {}) => {
      const room = rooms.get(String(roomId || "").toUpperCase());
      if (!room) return;

      const result = room.game.submitGuess(socket.id, text);
      if (!result.accepted) return;

      if (!result.correct) {
        room.broadcast("chat_message", {
          id: Date.now(),
          type: "chat",
          playerId: socket.id,
          playerName: result.player.name,
          text: result.guess,
        });
        return;
      }

      room.broadcast("guess_result", {
        playerId: socket.id,
        playerName: result.player.name,
        correct: true,
        points: result.points,
      });
      room.broadcast("chat_message", {
        id: Date.now(),
        type: "system",
        text: `${result.player.name} guessed the word and earned ${result.points} points.`,
      });
      emitRoomState(io, room);

      if (result.allGuessersCorrect) {
        endRound(io, room, "all_guessed").catch((error) => {
          console.error("Failed to end round after all guesses:", error.message);
        });
      }
    });

    socket.on("chat", ({ roomId, text } = {}) => {
      const room = rooms.get(String(roomId || "").toUpperCase());
      const player = room?.getPlayer(socket.id);
      const message = String(text || "").trim();
      if (!room || !player || !message) return;
      room.broadcast("chat_message", {
        id: Date.now(),
        type: "chat",
        playerId: socket.id,
        playerName: player.name,
        text: message,
      });
    });

    socket.on("draw_start", ({ roomId, point, color, size, mode } = {}) => {
      const room = rooms.get(String(roomId || "").toUpperCase());
      if (!room || room.game.drawerId !== socket.id || room.game.status !== "drawing") return;
      socket.to(room.id).emit("draw_start", { point, color, size, mode });
    });

    socket.on("draw_move", ({ roomId, point, color, size, mode } = {}) => {
      const room = rooms.get(String(roomId || "").toUpperCase());
      if (!room || room.game.drawerId !== socket.id || room.game.status !== "drawing") return;
      socket.to(room.id).emit("draw_move", { point, color, size, mode });
      socket.to(room.id).emit("draw_data", { point, color, size, mode });
    });

    socket.on("draw_end", ({ roomId } = {}) => {
      const room = rooms.get(String(roomId || "").toUpperCase());
      if (!room || room.game.drawerId !== socket.id) return;
      socket.to(room.id).emit("draw_end");
    });

    socket.on("canvas_clear", ({ roomId } = {}) => {
      const room = rooms.get(String(roomId || "").toUpperCase());
      if (!room || room.game.drawerId !== socket.id) return;
      room.broadcast("canvas_clear");
    });

    socket.on("draw_undo", ({ roomId } = {}) => {
      const room = rooms.get(String(roomId || "").toUpperCase());
      if (!room || room.game.drawerId !== socket.id) return;
      room.broadcast("draw_undo");
    });

    socket.on("disconnect", () => {
      rooms.forEach((room, roomId) => {
        const wasActiveDrawer = room.game.drawerId === socket.id && ["selecting", "drawing"].includes(room.game.status);
        const leaving = room.removePlayer(socket.id);
        if (!leaving) return;

        room.broadcast("player_left", {
          roomId,
          playerId: socket.id,
          players: room.serializePlayers(),
        });

        if (room.players.length === 0) {
          room.game.clearTimer();
          rooms.delete(roomId);
          return;
        }

        if (wasActiveDrawer) {
          endRound(io, room, "drawer_left").catch((error) => {
            console.error("Failed to end round after drawer disconnect:", error.message);
          });
          return;
        }

        emitRoomState(io, room);
      });
    });
  });
}

module.exports = registerSocketHandlers;
