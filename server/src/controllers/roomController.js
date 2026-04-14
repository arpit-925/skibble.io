const rooms = require("../store/rooms");

function listPublicRooms() {
  return [...rooms.values()]
    .filter((room) => !room.settings.isPrivate && room.game.status === "lobby")
    .map((room) => ({
      id: room.id,
      players: room.players.length,
      maxPlayers: room.settings.maxPlayers,
      rounds: room.settings.rounds,
      drawTime: room.settings.drawTime,
    }));
}

module.exports = {
  listPublicRooms,
};
