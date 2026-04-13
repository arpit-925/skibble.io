const { Server } = require("socket.io");

function initSocket(server) {
  return new Server(server, {
    cors: { origin: "*" },
  });
}

module.exports = initSocket;