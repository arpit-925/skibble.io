const { calculateDrawerBonus, calculateGuessPoints } = require("../utils/helpers");
const { getWordOptions } = require("../utils/words");

function registerGameHandler({ socket, services }) {
  socket.on("start_game", ({ roomId } = {}, acknowledgement) => {
    const membership = services.findMembershipBySocket(socket.id);
    const room = membership?.room || services.getRoom(roomId);
    const player = membership?.player;

    if (!room || !player || !room.isHost(player.id)) {
      if (typeof acknowledgement === "function") {
        acknowledgement({ ok: false, error: "Only the host can start the game." });
      }
      return;
    }

    if (room.players.length < 2) {
      if (typeof acknowledgement === "function") {
        acknowledgement({ ok: false, error: "At least two players are required." });
      }
      return;
    }

    room.game.resetForNewGame(room.settings);
    room.resetPlayersForRound();
    services.advanceTurn(room, getWordOptions);

    if (typeof acknowledgement === "function") {
      acknowledgement({ ok: true });
    }
  });

  socket.on("word_chosen", ({ roomId, word } = {}, acknowledgement) => {
    const membership = services.findMembershipBySocket(socket.id);
    const room = membership?.room || services.getRoom(roomId);
    const player = membership?.player;

    if (!room || !player || room.game.drawerId !== player.id) {
      if (typeof acknowledgement === "function") {
        acknowledgement({ ok: false, error: "Only the current drawer can choose a word." });
      }
      return;
    }

    const chosen = room.game.chooseWord(String(word || "").trim().toLowerCase());
    if (!chosen) {
      if (typeof acknowledgement === "function") {
        acknowledgement({ ok: false, error: "Invalid word choice." });
      }
      return;
    }

    services.io.to(room.id).emit("word_chosen", {
      drawerId: room.game.drawerId,
      word: room.game.selectedWord,
      maskedWord: room.game.getMaskedWord(),
      hints: room.game.getMaskedWord(),
      timeLeft: room.game.timeLeft,
    });
    services.emitRoomState(room);
    services.startRoundTimer(room);

    if (typeof acknowledgement === "function") {
      acknowledgement({ ok: true });
    }
  });

  socket.on("guess", ({ roomId, text } = {}, acknowledgement) => {
    const membership = services.findMembershipBySocket(socket.id);
    const room = membership?.room || services.getRoom(roomId);
    const player = membership?.player;

    if (!room || !player) {
      if (typeof acknowledgement === "function") {
        acknowledgement({ ok: false, error: "Room not found." });
      }
      return;
    }

    const result = services.evaluateGuess(room, player, text);
    if (!result.accepted) {
      if (typeof acknowledgement === "function") {
        acknowledgement({ ok: false, error: result.error });
      }
      return;
    }

    if (!result.correct) {
      services.io.to(room.id).emit("chat_message", {
        id: Date.now(),
        type: "chat",
        playerId: player.id,
        playerName: player.name,
        text: String(text || "").trim(),
      });

      if (typeof acknowledgement === "function") {
        acknowledgement({ ok: true, correct: false });
      }
      return;
    }

    const points = calculateGuessPoints({
      timeLeft: room.game.timeLeft,
      drawTime: room.settings.drawTime,
      guessOrder: room.game.correctGuessers.length,
    });
    player.hasGuessedCorrectly = true;
    player.addScore(points);
    room.game.correctGuessers.push(player.id);

    const drawer = room.getPlayerById(room.game.drawerId);
    if (drawer) {
      drawer.addScore(calculateDrawerBonus(1));
    }

    services.io.to(room.id).emit("guess_result", {
      correct: true,
      playerId: player.id,
      playerName: player.name,
      points,
      word: room.game.selectedWord,
    });
    services.io.to(room.id).emit("chat_message", {
      id: Date.now(),
      type: "system",
      text: `${player.name} guessed the word and earned ${points} points.`,
    });
    services.finishRound(room, "guessed");

    if (typeof acknowledgement === "function") {
      acknowledgement({ ok: true, correct: true, points });
    }
  });
}

module.exports = registerGameHandler;
