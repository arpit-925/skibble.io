const { getRandomWords } = require("../utils/wordList");
const { calculateGuessScore, calculateDrawerScore } = require("../utils/scoring");

class Game {
  constructor(room) {
    this.room = room;
    this.round = 1;
    this.turnIndex = -1;
    this.status = "lobby";
    this.drawerId = null;
    this.word = "";
    this.wordOptions = [];
    this.timeLeft = room.settings.drawTime;
    this.correctGuessOrder = [];
    this.timer = null;
    this.hintIndexes = [];
  }

  start() {
    this.round = 1;
    this.turnIndex = -1;
    this.status = "selecting";
    return this.nextTurn();
  }

  nextTurn() {
    this.clearTimer();
    const players = this.room.players;
    if (players.length < 2) {
      this.status = "lobby";
      return { type: "waiting" };
    }

    this.turnIndex += 1;
    if (this.turnIndex >= players.length) {
      this.turnIndex = 0;
      this.round += 1;
    }

    if (this.round > this.room.settings.rounds) {
      this.status = "game_over";
      return { type: "game_over" };
    }

    const drawer = players[this.turnIndex];
    this.drawerId = drawer.id;
    this.status = "selecting";
    this.word = "";
    this.timeLeft = this.room.settings.drawTime;
    this.correctGuessOrder = [];
    this.hintIndexes = [];
    this.wordOptions = getRandomWords(3, this.room.settings.category);
    this.room.players.forEach((player) => player.resetForRound());

    return {
      type: "round_start",
      drawer,
      publicState: this.getPublicState(),
      privateState: {
        wordOptions: this.wordOptions,
      },
    };
  }

  chooseWord(playerId, word) {
    if (this.status !== "selecting" || playerId !== this.drawerId) return false;
    if (!this.wordOptions.includes(word)) return false;

    this.word = word;
    this.status = "drawing";
    this.timeLeft = this.room.settings.drawTime;
    this.hintIndexes = this.buildHintIndexes();
    return true;
  }

  startTimer(onTick, onHint, onEnd) {
    this.clearTimer();
    this.timer = setInterval(() => {
      this.timeLeft -= 1;
      onTick(this.timeLeft);

      if (this.shouldRevealHint()) {
        onHint(this.getHint());
      }

      if (this.timeLeft <= 0) {
        onEnd("timeout");
      }
    }, 1000);
  }

  submitGuess(playerId, text) {
    const player = this.room.getPlayer(playerId);
    const guess = String(text || "").trim();

    if (!player || this.status !== "drawing" || player.id === this.drawerId || player.hasGuessed) {
      return { accepted: false, correct: false, guess };
    }

    const correct = guess.toLocaleLowerCase() === this.word.toLocaleLowerCase();
    if (!correct) {
      return { accepted: true, correct: false, guess, player };
    }

    player.hasGuessed = true;
    this.correctGuessOrder.push(player.id);
    const points = calculateGuessScore({
      timeLeft: this.timeLeft,
      drawTime: this.room.settings.drawTime,
      guessOrder: this.correctGuessOrder.length - 1,
    });
    player.addScore(points);

    const drawer = this.room.getPlayer(this.drawerId);
    if (drawer) drawer.addScore(calculateDrawerScore(1));

    const allGuessersCorrect = this.room.players
      .filter((candidate) => candidate.id !== this.drawerId)
      .every((candidate) => candidate.hasGuessed);

    return { accepted: true, correct: true, guess, player, points, allGuessersCorrect };
  }

  finishRound(reason) {
    this.clearTimer();
    this.status = "round_end";
    return {
      reason,
      word: this.word,
      players: this.room.serializePlayers(),
      nextRound: this.round,
    };
  }

  clearTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  buildHintIndexes() {
    const letters = this.word
      .split("")
      .map((char, index) => (/^[a-z]$/i.test(char) ? index : null))
      .filter((index) => index !== null);
    const maxHints = Math.min(this.room.settings.hints, letters.length);
    return letters.sort(() => Math.random() - 0.5).slice(0, maxHints);
  }

  shouldRevealHint() {
    if (!this.word || this.hintIndexes.length === 0) return false;
    const interval = Math.floor(this.room.settings.drawTime / (this.hintIndexes.length + 1));
    return interval > 0 && this.timeLeft > 0 && this.timeLeft % interval === 0;
  }

  getHint() {
    const elapsed = this.room.settings.drawTime - this.timeLeft;
    const interval = Math.floor(this.room.settings.drawTime / (this.hintIndexes.length + 1));
    const revealCount = Math.min(this.hintIndexes.length, Math.floor(elapsed / interval));
    const revealed = new Set(this.hintIndexes.slice(0, revealCount));

    return this.word
      .split("")
      .map((char, index) => {
        if (char === " ") return " ";
        return revealed.has(index) ? char : "_";
      })
      .join(" ");
  }

  getMaskedWord() {
    if (!this.word) return "";
    return this.word
      .split("")
      .map((char) => (char === " " ? " " : "_"))
      .join(" ");
  }

  getPublicState() {
    return {
      status: this.status,
      round: this.round,
      totalRounds: this.room.settings.rounds,
      drawerId: this.drawerId,
      timeLeft: this.timeLeft,
      hint: this.word ? this.getHint() : "",
      maskedWord: this.word ? this.getMaskedWord() : "",
      players: this.room.serializePlayers(),
      settings: this.room.settings,
    };
  }
}

module.exports = Game;
