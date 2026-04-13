class Game {
  constructor(players) {
    this.players = players;
    this.currentDrawerIndex = 0;
    this.word = "";
    this.round = 1;
  }

  getCurrentDrawer() {
    return this.players[this.currentDrawerIndex];
  }

  nextTurn() {
    this.currentDrawerIndex =
      (this.currentDrawerIndex + 1) % this.players.length;
  }
}

module.exports = Game;