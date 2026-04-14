const Game = require("./Game");
const Player = require("./Player");

const DEFAULT_SETTINGS = {
  maxPlayers: 8,
  rounds: 3,
  drawTime: 80,
  hints: 3,
  isPrivate: false,
  category: "general",
};

function clamp(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(number)));
}

class Room {
  constructor({ id, host, settings = {}, io }) {
    this.id = id;
    this.io = io;
    this.hostId = host.id;
    this.players = [new Player({ ...host, isHost: true })];
    this.settings = this.normalizeSettings(settings);
    this.game = new Game(this);
    this.createdAt = Date.now();
  }

  normalizeSettings(settings) {
    return {
      maxPlayers: clamp(settings.maxPlayers, 2, 20, DEFAULT_SETTINGS.maxPlayers),
      rounds: clamp(settings.rounds, 2, 10, DEFAULT_SETTINGS.rounds),
      drawTime: clamp(settings.drawTime, 15, 240, DEFAULT_SETTINGS.drawTime),
      hints: clamp(settings.hints, 0, 5, DEFAULT_SETTINGS.hints),
      isPrivate: Boolean(settings.isPrivate),
      category: settings.category || DEFAULT_SETTINGS.category,
    };
  }

  addPlayer({ id, name }) {
    if (this.players.length >= this.settings.maxPlayers) {
      return { ok: false, error: "Room is full." };
    }

    if (this.game.status !== "lobby") {
      return { ok: false, error: "Game already started." };
    }

    const existing = this.getPlayer(id);
    if (existing) {
      existing.connected = true;
      return { ok: true, player: existing };
    }

    const player = new Player({ id, name });
    this.players.push(player);
    return { ok: true, player };
  }

  removePlayer(playerId) {
    const leaving = this.getPlayer(playerId);
    const leavingIndex = this.players.findIndex((player) => player.id === playerId);
    this.players = this.players.filter((player) => player.id !== playerId);

    if (leavingIndex !== -1 && leavingIndex <= this.game.turnIndex) {
      this.game.turnIndex -= 1;
    }

    if (this.hostId === playerId && this.players.length > 0) {
      this.hostId = this.players[0].id;
      this.players[0].isHost = true;
    }

    return leaving;
  }

  getPlayer(playerId) {
    return this.players.find((player) => player.id === playerId);
  }

  isHost(playerId) {
    return this.hostId === playerId;
  }

  broadcast(event, payload) {
    this.io.to(this.id).emit(event, payload);
  }

  serializePlayers() {
    return this.players.map((player) => ({
      ...player.serialize(),
      isHost: player.id === this.hostId,
    }));
  }

  serializeFor(playerId) {
    const state = this.game.getPublicState();
    const isDrawer = this.game.drawerId === playerId;
    return {
      id: this.id,
      hostId: this.hostId,
      settings: this.settings,
      players: this.serializePlayers(),
      game: {
        ...state,
        isDrawer,
        word: isDrawer ? this.game.word : undefined,
        wordOptions: isDrawer && this.game.status === "selecting" ? this.game.wordOptions : [],
      },
    };
  }
}

module.exports = Room;
