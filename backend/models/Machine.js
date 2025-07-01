const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  pricePerHour: { type: Number },
  available: { type: Boolean, default: true },
  imageUrl: { type: String }
});

module.exports = mongoose.model("Machine", machineSchema);
