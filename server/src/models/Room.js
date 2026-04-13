const Game = require("./Game");

class Room {
  constructor(id, hostId) {
    this.id = id;
    this.players = [];
    this.host = hostId;
    this.game = null;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(playerId) {
    this.players = this.players.filter(p => p.id !== playerId);
  }

  startGame() {
    this.game = new Game(this.players);
  }
}

module.exports = Room;