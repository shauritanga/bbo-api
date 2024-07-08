const mongoose = require("mongoose");
const PaymentCounter = require("./counter/paymentCounter.js");
const paymentSchema = mongoose.Schema({
  paymentId: { type: String, unique: true },
  date: {
    type: Date,
    default: Date.now,
  },
  payee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  category: {
    type: String,
  },
  method: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentMethod",
  },
  realAccount: {
    type: String,
  },
  amount: {
    type: Number,
  },
  chequeNumber: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
  },
});

paymentSchema.pre("save", async function (next) {
  if (this.isNew) {
    const paymentCounter = await PaymentCounter.findByIdAndUpdate(
      { _id: "paymentId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seq = String(paymentCounter.seq).padStart(5, "0");
    this.paymentId = `PAY${seq}`;
  }
  next();
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
