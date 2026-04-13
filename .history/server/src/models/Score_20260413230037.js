const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  playerName: String,
  score: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Score", scoreSchema);