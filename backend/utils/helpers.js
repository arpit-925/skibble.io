const { v4: uuidv4 } = require("uuid");

const DEFAULT_SETTINGS = {
  maxPlayers: 8,
  rounds: 3,
  drawTime: 80,
  hints: 2,
  wordChoices: 3,
  isPrivate: false,
  category: "general",
};

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(parsed)));
}

function sanitizeName(name) {
  const normalized = String(name || "Player").trim().replace(/\s+/g, " ");
  return normalized.slice(0, 24) || "Player";
}

function normalizeGuess(text) {
  return String(text || "").trim().toLocaleLowerCase();
}

function createRoomId() {
  return uuidv4().split("-")[0].toUpperCase();
}

function normalizeRoomSettings(settings = {}) {
  return {
    maxPlayers: clampNumber(settings.maxPlayers, 2, 20, DEFAULT_SETTINGS.maxPlayers),
    rounds: clampNumber(settings.rounds, 1, 20, DEFAULT_SETTINGS.rounds),
    drawTime: clampNumber(settings.drawTime, 15, 240, DEFAULT_SETTINGS.drawTime),
    hints: clampNumber(settings.hints, 0, 5, DEFAULT_SETTINGS.hints),
    wordChoices: clampNumber(settings.wordChoices, 1, 5, DEFAULT_SETTINGS.wordChoices),
    isPrivate: Boolean(settings.isPrivate),
    category: String(settings.category || DEFAULT_SETTINGS.category).trim().toLowerCase() || DEFAULT_SETTINGS.category,
  };
}

function maskWord(word, revealedIndexes = []) {
  const revealed = new Set(revealedIndexes);

  return String(word || "")
    .split("")
    .map((character, index) => {
      if (character === " ") return " ";
      return revealed.has(index) ? character : "_";
    })
    .join(" ");
}

function getRevealPlan(word, hintCount) {
  const indexes = String(word || "")
    .split("")
    .map((character, index) => (/^[a-z]$/i.test(character) ? index : null))
    .filter((index) => index !== null);

  return indexes
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(hintCount, indexes.length));
}

function calculateGuessPoints({ timeLeft, drawTime, guessOrder }) {
  const speedRatio = drawTime > 0 ? timeLeft / drawTime : 0;
  const baseScore = 120;
  const speedBonus = Math.round(speedRatio * 80);
  const orderPenalty = guessOrder * 15;
  return Math.max(25, baseScore + speedBonus - orderPenalty);
}

function calculateDrawerBonus(correctGuessCount) {
  return correctGuessCount > 0 ? 40 : 0;
}

function buildLeaderboard(players) {
  return [...players]
    .sort((left, right) => right.score - left.score)
    .map((player, index) => ({
      rank: index + 1,
      id: player.id,
      name: player.name,
      score: player.score,
      isHost: player.isHost,
    }));
}

function findRoomBySocketId(rooms, socketId) {
  for (const room of rooms.values()) {
    const player = room.players.find((candidate) => candidate.socketId === socketId);
    if (player) return { room, player };
  }

  return null;
}

module.exports = {
  DEFAULT_SETTINGS,
  buildLeaderboard,
  calculateDrawerBonus,
  calculateGuessPoints,
  clampNumber,
  createRoomId,
  findRoomBySocketId,
  getRevealPlan,
  maskWord,
  normalizeGuess,
  normalizeRoomSettings,
  sanitizeName,
};
