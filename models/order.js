const mongoose = require("mongoose");
const OrderCounter = require("./counter/orderCounter.js");

const orderSchema = mongoose.Schema(
  {
    uid: { type: String, unique: true },
    client_id: { type: String, required: true },
    volume: { type: Number },
    price: { type: Number },
    amount: { type: Number },
    total_fees: { type: Number },
    type: { type: String },
    security_id: { type: String, required: true },
    status: { type: String, default: "new" },
    mode: { type: String },
    executed: { type: Number, default: 0 },
    vat: { type: Number },
    total_commissions: { type: Number },
    brokerage: { type: Number },
    cmsa: { type: Number },
    fidelity: { type: Number },
    dse: { type: Number },
    payout: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    cds: { type: Number },
    financial_year_id: { type: String },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.isNew) {
    const orderCounter = await OrderCounter.findByIdAndUpdate(
      { _id: "uid" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seq = String(orderCounter.seq).padStart(5, "0");
    doc.uid = `AOR${seq}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
