function registerRoomHandler({ socket, services }) {
  socket.on("create_room", ({ name, settings } = {}, acknowledgement) => {
    const room = services.createRoom({
      hostName: name,
      socketId: socket.id,
      settings,
      playerId: socket.id,
    });

    socket.join(room.id);
    services.emitRoomState(room);

    if (typeof acknowledgement === "function") {
      acknowledgement({
        ok: true,
        roomId: room.id,
        playerId: room.hostId,
        room: room.serializeForPlayer(room.hostId),
      });
    }
  });

  socket.on("join_room", ({ roomId, name } = {}, acknowledgement) => {
    const room = services.getRoom(roomId);
    if (!room) {
      if (typeof acknowledgement === "function") {
        acknowledgement({ ok: false, error: "Room not found." });
      }
      return;
    }

    const result = room.addPlayer({
      playerId: socket.id,
      socketId: socket.id,
      name,
    });

    if (!result.ok) {
      if (typeof acknowledgement === "function") {
        acknowledgement({ ok: false, error: result.error });
      }
      return;
    }

    socket.join(room.id);

    services.io.to(room.id).emit("player_joined", {
      roomId: room.id,
      player: result.player.serialize(),
      players: room.serializePlayers(),
    });
    services.emitRoomState(room);

    if (typeof acknowledgement === "function") {
      acknowledgement({
        ok: true,
        roomId: room.id,
        playerId: result.player.id,
        room: room.serializeForPlayer(result.player.id),
      });
    }
  });
}

module.exports = registerRoomHandler;
