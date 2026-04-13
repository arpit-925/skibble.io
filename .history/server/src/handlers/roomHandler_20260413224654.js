const rooms = require("../store/rooms");
const Room = require("../models/Room");
const Player = require("../models/Player");

function handleJoinRoom(socket, io) {
  socket.on("join_room", ({ roomId, name }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = new Room(roomId, socket.id);
    }

    const room = rooms[roomId];

    const player = new Player(socket.id, name);
    room.addPlayer(player);

    socket.join(roomId);

    io.to(roomId).emit("player_list", {
      players: room.players,
      host: room.host,
    });
  });
}

module.exports = handleJoinRoom;