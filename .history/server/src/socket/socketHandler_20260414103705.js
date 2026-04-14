const Room = require('../models/Room');
const { getRandomWords } = require('../utils/wordList');

const rooms = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    
    socket.on('create_room', ({ name, settings }) => {
      const roomId = Math.random().toString(36).substring(2, 8);
      const player = { id: socket.id, name, score: 0, isReady: false };
      const newRoom = new Room(roomId, settings, player);
      rooms.set(roomId, newRoom);
      socket.join(roomId);
      socket.emit('room_created', { roomId, room: newRoom });
    });

    socket.on('join_room', ({ roomId, name }) => {
      const room = rooms.get(roomId);
      if (room && room.addPlayer({ id: socket.id, name, score: 0 })) {
        socket.join(roomId);
        io.to(roomId).emit('player_joined', room);
      } else {
        socket.emit('error', 'Room full or not found');
      }
    });

    // DRAWING EVENTS
    socket.on('draw_start', ({ roomId, x, y, color, size }) => {
      socket.to(roomId).emit('draw_start', { x, y, color, size });
    });

    socket.on('draw_move', ({ roomId, x, y }) => {
      socket.to(roomId).emit('draw_move', { x, y });
    });

    socket.on('canvas_clear', (roomId) => {
      io.to(roomId).emit('canvas_clear');
    });

    // GUESSING LOGIC
    socket.on('guess', ({ roomId, text }) => {
      const room = rooms.get(roomId);
      if (!room || room.gameState !== 'DRAWING') return;

      if (text.toLowerCase() === room.currentWord.toLowerCase()) {
        // Scoring logic based on timeLeft
        const player = room.players.find(p => p.id === socket.id);
        player.score += Math.floor(room.timeLeft * 10);
        io.to(roomId).emit('guess_result', { playerId: socket.id, correct: true, name: player.name });
        
        // Logic to end round if everyone guessed...
      } else {
        io.to(roomId).emit('chat_message', { name: socket.id, text });
      }
    });
  });
};