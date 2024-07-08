const mongoose = require("mongoose");

const dseSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
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
