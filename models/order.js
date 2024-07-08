const mongoose = require("mongoose");
const OrderCounter = require("./counter/orderCounter.js");

const orderSchema = mongoose.Schema({
  orderId: { type: String, unique: true },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  volume: {
    type: Number,
  },
  price: {
    type: Number,
  },
  amount: {
    type: Number,
  },
  fees: {
    type: Number,
  },
  total: {
    type: Number,
  },
  action: {
    type: String,
  },
  type: {
    type: String,
  },
  security: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Security",
  },
  status: {
    type: String,
    default: "new",
  },
  balance: {
    type: Number,
  },
});

orderSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.isNew) {
    const orderCounter = await OrderCounter.findByIdAndUpdate(
      { _id: "orderId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seq = String(orderCounter.seq).padStart(5, "0");
    doc.orderId = `AOR${seq}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
