function registerDrawHandler({ socket, services }) {
  socket.on("draw_start", ({ roomId, point, color, size } = {}) => {
    const membership = services.findMembershipBySocket(socket.id);
    const room = membership?.room || services.getRoom(roomId);
    const player = membership?.player;

    if (!services.canDraw(room, player)) return;

    const stroke = {
      type: "draw_start",
      point,
      color,
      size,
      socketId: socket.id,
      timestamp: Date.now(),
    };

    room.game.addStroke(stroke);
    services.io.to(room.id).emit("draw_start", stroke);
    services.io.to(room.id).emit("draw_data", stroke);
  });

  socket.on("draw_move", ({ roomId, point, color, size } = {}) => {
    const membership = services.findMembershipBySocket(socket.id);
    const room = membership?.room || services.getRoom(roomId);
    const player = membership?.player;

    if (!services.canDraw(room, player)) return;

    const stroke = {
      type: "draw_move",
      point,
      color,
      size,
      socketId: socket.id,
      timestamp: Date.now(),
    };

    room.game.addStroke(stroke);
    services.io.to(room.id).emit("draw_move", stroke);
    services.io.to(room.id).emit("draw_data", stroke);
  });

  socket.on("draw_end", ({ roomId } = {}) => {
    const membership = services.findMembershipBySocket(socket.id);
    const room = membership?.room || services.getRoom(roomId);
    const player = membership?.player;

    if (!services.canDraw(room, player)) return;

    services.io.to(room.id).emit("draw_end", {
      socketId: socket.id,
      timestamp: Date.now(),
    });
  });

  socket.on("canvas_clear", ({ roomId } = {}) => {
    const membership = services.findMembershipBySocket(socket.id);
    const room = membership?.room || services.getRoom(roomId);
    const player = membership?.player;

    if (!services.canDraw(room, player)) return;

    room.game.clearCanvas();
    services.io.to(room.id).emit("canvas_clear");
  });

  socket.on("draw_undo", ({ roomId } = {}) => {
    const membership = services.findMembershipBySocket(socket.id);
    const room = membership?.room || services.getRoom(roomId);
    const player = membership?.player;

    if (!services.canDraw(room, player)) return;

    room.game.undoLastStroke();
    services.io.to(room.id).emit("draw_undo");
  });
}

module.exports = registerDrawHandler;
