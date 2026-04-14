const { Server } = require("socket.io");
const Room = require("../models/Room");
const registerRoomHandler = require("./roomHandler");
const registerGameHandler = require("./gameHandler");
const registerDrawHandler = require("./drawHandler");
const registerChatHandler = require("./chatHandler");
const {
  buildLeaderboard,
  createRoomId,
  findRoomBySocketId,
  normalizeGuess,
} = require("../utils/helpers");

const rooms = new Map();

function initializeSocket(httpServer, options = {}) {
  const allowedOrigins = [options.clientUrl, "https://skibble-io.vercel.app"].filter(Boolean);
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const services = {
    io,
    rooms,

    createRoom({ hostName, socketId, settings, playerId }) {
      // Room ids are public-facing, so we keep them short and easy to share.
      let roomId = createRoomId();
      while (rooms.has(roomId)) roomId = createRoomId();

      const room = new Room({
        id: roomId,
        hostName,
        hostSocketId: socketId,
        hostPlayerId: playerId,
        settings,
      });

      rooms.set(roomId, room);
      return room;
    },

    getRoom(roomId) {
      return rooms.get(String(roomId || "").trim().toUpperCase());
    },

    findMembershipBySocket(socketId) {
      return findRoomBySocketId(rooms, socketId);
    },

    emitRoomState(room) {
      // Each client receives a filtered state snapshot so only the drawer sees the actual word/options.
      room.players.forEach((player) => {
        io.to(player.socketId).emit("game_state", room.serializeForPlayer(player.id));
      });
    },

    canDraw(room, player) {
      return Boolean(room && player && room.game.status === "drawing" && room.game.drawerId === player.id);
    },

    advanceTurn(room, getWordOptions) {
      room.game.clearTimer();
      room.resetPlayersForRound();

      // The game model decides who draws next; the socket layer only coordinates events.
      const transition = room.game.startNextTurn(
        room.players,
        getWordOptions(room.settings.category, room.settings.wordChoices),
      );

      if (transition.type === "waiting") {
        this.emitRoomState(room);
        return;
      }

      if (transition.type === "game_over") {
        this.finishGame(room);
        return;
      }

      io.to(room.id).emit("canvas_clear");
      io.to(room.id).emit("round_start", {
        roomId: room.id,
        round: room.game.round,
        totalRounds: room.settings.rounds,
        drawerId: room.game.drawerId,
        drawerName: transition.drawer.name,
      });
      this.emitRoomState(room);
    },

    startRoundTimer(room) {
      room.game.clearTimer();

      // A single room-level timer drives round expiry and progressive hint reveal.
      room.game.timer = setInterval(() => {
        const result = room.game.tick();
        this.emitRoomState(room);

        if (result.finished) {
          this.finishRound(room, "timeout");
        }
      }, 1000);
    },

    finishRound(room, reason) {
      if (!room || ["round_end", "game_over"].includes(room.game.status)) return;

      room.game.clearTimer();
      room.game.status = "round_end";

      io.to(room.id).emit("round_end", room.game.buildRoundSummary(reason, room.players));
      this.emitRoomState(room);

      setTimeout(() => {
        if (!rooms.has(room.id)) return;
        this.advanceTurn(room, require("../utils/words").getWordOptions);
      }, 2500);
    },

    finishGame(room) {
      room.game.clearTimer();
      room.game.status = "game_over";

      const leaderboard = buildLeaderboard(room.players);
      io.to(room.id).emit("game_over", {
        roomId: room.id,
        winner: leaderboard[0] || null,
        leaderboard,
      });
      this.emitRoomState(room);
    },

    evaluateGuess(room, player, text) {
      if (!room || !player) {
        return { accepted: false, error: "Player not found." };
      }

      if (room.game.status !== "drawing") {
        return { accepted: false, error: "Round is not active." };
      }

      if (room.game.drawerId === player.id) {
        return { accepted: false, error: "Drawer cannot guess." };
      }

      if (player.hasGuessedCorrectly) {
        return { accepted: false, error: "Player already guessed correctly." };
      }

      // Guess validation is intentionally case-insensitive and trimmed to match the requirement.
      const normalizedAttempt = normalizeGuess(text);
      if (!normalizedAttempt) {
        return { accepted: false, error: "Guess is empty." };
      }

      const normalizedWord = normalizeGuess(room.game.selectedWord);
      return {
        accepted: true,
        correct: normalizedAttempt === normalizedWord,
      };
    },

    removeSocket(socket) {
      const membership = this.findMembershipBySocket(socket.id);
      if (!membership) return;

      const { room, player } = membership;
      const wasDrawer = room.game.drawerId === player.id;
      room.removePlayer(player.id);

      io.to(room.id).emit("player_left", {
        roomId: room.id,
        playerId: player.id,
        players: room.serializePlayers(),
      });

      if (room.players.length === 0) {
        room.game.clearTimer();
        rooms.delete(room.id);
        return;
      }

      if (room.players.length < 2 && room.game.status !== "lobby") {
        this.finishGame(room);
        return;
      }

      if (wasDrawer && ["drawing", "selecting"].includes(room.game.status)) {
        this.finishRound(room, "drawer_left");
        return;
      }

      this.emitRoomState(room);
    },
  };

  io.on("connection", (socket) => {
    registerRoomHandler({ socket, services });
    registerGameHandler({ socket, services });
    registerDrawHandler({ socket, services });
    registerChatHandler({ socket, services });

    socket.on("disconnect", () => {
      services.removeSocket(socket);
    });
  });

  return { io, rooms };
}

module.exports = {
  initializeSocket,
  rooms,
};
