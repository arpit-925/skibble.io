const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    category: { type: String, default: "general", index: true },
    difficulty: { type: String, default: "normal" },
  },
  { versionKey: false },
);

module.exports = mongoose.models.Word || mongoose.model("Word", wordSchema);
