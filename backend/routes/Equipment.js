const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  pricePerHour: { type: Number },
  available: { type: Boolean, default: true },
  imageUrl: { type: String }
});

module.exports = mongoose.model("Equipment", equipmentSchema);
