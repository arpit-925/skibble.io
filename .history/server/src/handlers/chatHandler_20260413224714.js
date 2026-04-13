function handleChat(socket, io) {
  socket.on("chat", ({ roomId, text }) => {
    io.to(roomId).emit("chat_message", {
      text,
      sender: socket.id,
    });
  });
}

module.exports = handleChat;