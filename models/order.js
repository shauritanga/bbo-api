const mongoose = require("mongoose");
const OrderCounter = require("./counter/orderCounter.js");

const orderSchema = mongoose.Schema(
  {
    id: { type: String },
    uid: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    volume: { type: Number },
    price: { type: Number },
    amount: { type: Number },
    totalFees: { type: Number },
    type: { type: String },
    security: { type: mongoose.Schema.Types.ObjectId, ref: "Security" },
    status: { type: String, default: "new" },
    executed: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    holding: { type: String },
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
