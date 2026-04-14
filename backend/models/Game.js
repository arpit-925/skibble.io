const { getRevealPlan, maskWord } = require("../utils/helpers");

class Game {
  constructor(settings) {
    this.settings = settings;
    this.status = "lobby";
    this.round = 0;
    this.drawerIndex = -1;
    this.drawerId = null;
    this.selectedWord = "";
    this.wordOptions = [];
    this.timeLeft = settings.drawTime;
    this.revealPlan = [];
    this.revealedIndexes = [];
    this.correctGuessers = [];
    this.timer = null;
    this.strokes = [];
  }

  resetForNewGame(settings) {
    this.settings = settings;
    this.status = "lobby";
    this.round = 0;
    this.drawerIndex = -1;
    this.drawerId = null;
    this.selectedWord = "";
    this.wordOptions = [];
    this.timeLeft = settings.drawTime;
    this.revealPlan = [];
    this.revealedIndexes = [];
    this.correctGuessers = [];
    this.strokes = [];
  }

  startNextTurn(players, wordOptions) {
    if (players.length < 2) {
      this.status = "lobby";
      this.drawerId = null;
      return { type: "waiting" };
    }

    this.drawerIndex += 1;

    if (this.drawerIndex >= players.length) {
      this.drawerIndex = 0;
      this.round += 1;
    }

    if (this.round === 0) {
      this.round = 1;
    }

    if (this.round > this.settings.rounds) {
      this.status = "game_over";
      return { type: "game_over" };
    }

    const drawer = players[this.drawerIndex];
    this.status = "selecting";
    this.drawerId = drawer.id;
    this.wordOptions = wordOptions;
    this.selectedWord = "";
    this.timeLeft = this.settings.drawTime;
    this.revealPlan = [];
    this.revealedIndexes = [];
    this.correctGuessers = [];
    this.strokes = [];

    return { type: "round_start", drawer };
  }

  chooseWord(word) {
    if (this.status !== "selecting" || !this.wordOptions.includes(word)) return false;

    this.selectedWord = word;
    this.status = "drawing";
    this.timeLeft = this.settings.drawTime;
    this.revealPlan = getRevealPlan(word, this.settings.hints);
    this.revealedIndexes = [];
    return true;
  }

  tick() {
    if (this.status !== "drawing") {
      return { finished: false, hintChanged: false };
    }

    // The timer is intentionally authoritative on the server to keep all clients in sync.
    this.timeLeft -= 1;
    const hintChanged = this.revealNextHintIfNeeded();
    return {
      finished: this.timeLeft <= 0,
      hintChanged,
    };
  }

  revealNextHintIfNeeded() {
    if (!this.selectedWord || this.revealPlan.length === 0) return false;

    const hintInterval = Math.floor(this.settings.drawTime / (this.revealPlan.length + 1));
    if (hintInterval <= 0) return false;

    const shouldReveal = this.timeLeft > 0 && this.timeLeft % hintInterval === 0;
    if (!shouldReveal) return false;

    const nextRevealIndex = this.revealPlan[this.revealedIndexes.length];
    if (typeof nextRevealIndex !== "number") return false;

    this.revealedIndexes.push(nextRevealIndex);
    return true;
  }

  getMaskedWord() {
    return maskWord(this.selectedWord, this.revealedIndexes);
  }

  addStroke(stroke) {
    this.strokes.push(stroke);
  }

  clearCanvas() {
    this.strokes = [];
  }

  undoLastStroke() {
    this.strokes.pop();
  }

  clearTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  buildRoundSummary(reason, players) {
    return {
      reason,
      round: this.round,
      drawerId: this.drawerId,
      word: this.selectedWord,
      scores: players.map((player) => player.serialize()),
    };
  }
}

module.exports = Game;
