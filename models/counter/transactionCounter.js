const mongoose = require("mongoose");

const transactionCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const TransactionCounter = mongoose.model(
  "TransactionCounter",
  transactionCounterSchema
);

module.exports = TransactionCounter;
