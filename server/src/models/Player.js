class Player {
  constructor({ id, name, isHost = false }) {
    this.id = id;
    this.name = String(name || "Player").trim().slice(0, 24) || "Player";
    this.score = 0;
    this.isHost = isHost;
    this.hasGuessed = false;
    this.connected = true;
  }

  resetForRound() {
    this.hasGuessed = false;
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
      hasGuessed: this.hasGuessed,
      connected: this.connected,
    };
  }
}

module.exports = Player;
