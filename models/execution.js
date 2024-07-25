const mongoose = require("mongoose");

const dseSchema = new mongoose.Schema({
  trading_date: {
    type: Date,
    default: Date.now,
  },
  settlement_date: {
    type: Date,
  },
  order_id: {
    type: String,
  },
  slip: {
    type: String,
  },
  price: {
    type: Number,
  },
  executed: { type: Number },
  totalFees: {
    type: Number,
  },
  total: {
    type: Number,
  },
  dse: Number,
  cds: Number,
  csma: Number,
  fidelity: Number,
  vat: Number,
  brokerage: Number,
  amount: {
    type: Number,
  },
});

module.exports = mongoose.model("Execution", dseSchema);
