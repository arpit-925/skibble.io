const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, index: true },
    playerId: { type: String, required: true },
    playerName: { type: String, required: true },
    score: { type: Number, required: true, min: 0 },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false },
);

module.exports = mongoose.models.Score || mongoose.model("Score", scoreSchema);
