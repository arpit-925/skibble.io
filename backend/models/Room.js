const Game = require("./Game");
const Player = require("./Player");
const { buildLeaderboard, normalizeRoomSettings } = require("../utils/helpers");

class Room {
  constructor({ id, hostName, hostSocketId, hostPlayerId, settings }) {
    this.id = id;
    this.settings = normalizeRoomSettings(settings);
    this.hostId = hostPlayerId;
    this.players = [
      new Player({
        id: hostPlayerId,
        socketId: hostSocketId,
        name: hostName,
        isHost: true,
      }),
    ];
    this.game = new Game(this.settings);
    this.createdAt = Date.now();
  }

  getPlayerById(playerId) {
    return this.players.find((player) => player.id === playerId);
  }

  getPlayerBySocketId(socketId) {
    return this.players.find((player) => player.socketId === socketId);
  }

  isHost(playerId) {
    return this.hostId === playerId;
  }

  addPlayer({ playerId, socketId, name }) {
    if (this.players.length >= this.settings.maxPlayers) {
      return { ok: false, error: "Room is full." };
    }

    if (this.game.status !== "lobby") {
      return { ok: false, error: "Game already started." };
    }

    const player = new Player({ id: playerId, socketId, name });
    this.players.push(player);
    return { ok: true, player };
  }

  removePlayer(playerId) {
    const leavingIndex = this.players.findIndex((player) => player.id === playerId);
    if (leavingIndex === -1) return null;

    const leavingPlayer = this.players[leavingIndex];
    this.players.splice(leavingIndex, 1);

    if (leavingIndex <= this.game.drawerIndex) {
      this.game.drawerIndex -= 1;
    }

    if (this.hostId === playerId && this.players.length > 0) {
      this.players.forEach((player) => {
        player.isHost = false;
      });
      this.players[0].isHost = true;
      this.hostId = this.players[0].id;
    }

    return leavingPlayer;
  }

  resetPlayersForRound() {
    this.players.forEach((player) => player.resetForRound());
  }

  serializePlayers() {
    return this.players.map((player) => player.serialize());
  }

  serializeForPlayer(playerId) {
    const isDrawer = this.game.drawerId === playerId;
    const drawer = this.getPlayerById(this.game.drawerId);

    // The drawer gets the real word while guessers receive only the masked version.
    return {
      id: this.id,
      hostId: this.hostId,
      settings: this.settings,
      players: this.serializePlayers(),
      leaderboard: buildLeaderboard(this.players),
      game: {
        status: this.game.status,
        round: this.game.round,
        totalRounds: this.settings.rounds,
        drawerId: this.game.drawerId,
        drawerName: drawer?.name || null,
        timeLeft: this.game.timeLeft,
        word: isDrawer ? this.game.selectedWord : undefined,
        maskedWord: isDrawer ? this.game.selectedWord : this.game.getMaskedWord(),
        wordOptions: isDrawer && this.game.status === "selecting" ? this.game.wordOptions : [],
        isDrawer,
      },
    };
  }
}

module.exports = Room;
