const mongoose = require("mongoose");

const dseSchema = new mongoose.Schema(
  {
    tradingDate: {
      type: Date,
      default: Date.now,
    },
    settlementDate: {
      type: Date,
    },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    slip: {
      type: String,
      unique: true,
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
    type: String,
    dse: Number,
    cds: Number,
    cmsa: Number,
    fidelity: Number,
    vat: Number,
    brokerage: Number,
    totalCommission: Number,
    closed: { type: String, default: "no" },
    payout: Number,
    amount: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Execution", dseSchema);
