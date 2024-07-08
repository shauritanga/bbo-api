const mongoose = require("mongoose");

const csmaSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  reference: String,
  value: {
    type: Number,
  },
});

module.exports = mongoose.model("CSMA", csmaSchema);
