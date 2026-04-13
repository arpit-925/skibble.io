const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  category: String,
  difficulty: String,
});

module.exports = mongoose.model("Word", wordSchema);