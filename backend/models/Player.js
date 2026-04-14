const { sanitizeName } = require("../utils/helpers");

class Player {
  constructor({ id, socketId, name, isHost = false }) {
    this.id = id;
    this.socketId = socketId;
    this.name = sanitizeName(name);
    this.isHost = isHost;
    this.score = 0;
    this.hasGuessedCorrectly = false;
    this.connected = true;
  }

  resetForRound() {
    this.hasGuessedCorrectly = false;
  }

  addScore(points) {
    this.score += Math.max(0, Math.floor(points));
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      score: this.score,
      isHost: this.isHost,
      hasGuessedCorrectly: this.hasGuessedCorrectly,
      connected: this.connected,
    };
  }
}

module.exports = Player;
