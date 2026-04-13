const rooms = require("../store/rooms");

function handleGame(socket, io) {
  socket.on("start_game", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;

    room.startGame();

    const drawer = room.game.getCurrentDrawer();

    io.to(roomId).emit("game_start", {
      drawerId: drawer.id,
    });
  });
}

module.exports = handleGame;