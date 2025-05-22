// models/Color.js
const mongoose = require("mongoose");

const ColorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hexCode: { type: String }, // Optional field for color hex code
});

module.exports = mongoose.model("Color", ColorSchema);
