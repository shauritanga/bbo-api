const mongoose = require("mongoose");

const paymentCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const PaymentCounter = mongoose.model("PaymentCounter", paymentCounterSchema);

module.exports = PaymentCounter;
