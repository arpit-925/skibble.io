const express = require("express");
const http = require("http");
const cors = require("cors");

const initSocket = require("./config/socket");

const handleJoinRoom = require("./handlers/roomHandler");
const handleDraw = require("./handlers/drawHandler");
const handleChat = require("./handlers/chatHandler");
const handleGame = require("./handlers/gameHandler");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = initSocket(server);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  handleJoinRoom(socket, io);
  handleDraw(socket, io);
  handleChat(socket, io);
  handleGame(socket, io);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});