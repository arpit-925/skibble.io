function registerChatHandler({ socket, services }) {
  socket.on("chat", ({ roomId, text } = {}, acknowledgement) => {
    const membership = services.findMembershipBySocket(socket.id);
    const room = membership?.room || services.getRoom(roomId);
    const player = membership?.player;
    const message = String(text || "").trim();

    if (!room || !player || !message) {
      if (typeof acknowledgement === "function") {
        acknowledgement({ ok: false, error: "Message is empty." });
      }
      return;
    }

    services.io.to(room.id).emit("chat_message", {
      id: Date.now(),
      type: "chat",
      playerId: player.id,
      playerName: player.name,
      text: message,
    });

    if (typeof acknowledgement === "function") {
      acknowledgement({ ok: true });
    }
  });
}

module.exports = registerChatHandler;
