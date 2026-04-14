const mongoose = require("mongoose");
const Score = require("../models/Score");

function getDatabaseStatus() {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] || "unknown";
}

async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI is not set. MongoDB persistence is disabled for this process.");
    return null;
  }

  mongoose.set("strictQuery", true);

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    return null;
  }
}

async function saveGameScores(roomId, players) {
  if (mongoose.connection.readyState !== 1) return;

  const createdAt = new Date();
  await Score.insertMany(
    players.map((player) => ({
      roomId,
      playerId: player.id,
      playerName: player.name,
      score: player.score,
      createdAt,
    })),
  );
}

module.exports = {
  connectDB,
  getDatabaseStatus,
  saveGameScores,
};
