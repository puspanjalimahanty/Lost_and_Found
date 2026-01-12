const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  dateFound: { type: Date, required: true },
  imagePath: { type: String },   // ✅ optional image
}, { timestamps: true });

module.exports = mongoose.model("FoundItem", foundItemSchema);
