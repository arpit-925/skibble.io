class Room {
  constructor(id, settings, host) {
    this.id = id;
    this.settings = settings; // rounds, drawTime, maxPlayers
    this.players = [host];
    this.hostId = host.id;
    this.gameState = 'LOBBY'; // LOBBY, STARTING, DRAWING, ROUND_END, GAME_OVER
    this.currentRound = 0;
    this.currentDrawerIndex = -1;
    this.wordOptions = [];
    this.currentWord = "";
    this.timer = null;
    this.timeLeft = 0;
  }

  addPlayer(player) {
    if (this.players.length < this.settings.maxPlayers) {
      this.players.push(player);
      return true;
    }
    return false;
  }

  removePlayer(playerId) {
    this.players = this.players.filter(p => p.id !== playerId);
  }
}
module.exports = Room;