function handleDraw(socket, io) {
  socket.on("draw", ({ roomId, x, y, color, size }) => {
    socket.to(roomId).emit("draw", { x, y, color, size });
  });

  socket.on("canvas_clear", ({ roomId }) => {
    io.to(roomId).emit("canvas_clear");
  });
}

module.exports = handleDraw;