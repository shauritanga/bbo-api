const mongoose = require("mongoose");

const receiptCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const ReceiptCounter = mongoose.model("ReceiptCounter", receiptCounterSchema);

module.exports = ReceiptCounter;
