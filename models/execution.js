const mongoose = require("mongoose");

const dseSchema = new mongoose.Schema(
  {
    id: String,
    tradingDate: {
      type: Date,
      default: Date.now,
    },
    settlementDate: {
      type: Date,
    },
    userId: String,
    securityId: String,
    orderId: {
      type: String,
    },
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
    status: { type: String, default: "pending" },
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
