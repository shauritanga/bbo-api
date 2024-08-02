const mongoose = require("mongoose");

const dseSchema = new mongoose.Schema(
  {
    id: String,
    trading_date: {
      type: Date,
      default: Date.now,
    },
    settlement_date: {
      type: Date,
    },
    client_id: String,
    security_id: String,
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
