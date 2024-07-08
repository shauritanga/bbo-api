const mongoose = require("mongoose");

const orderCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const OrderCounter = mongoose.model("OrderCounter", orderCounterSchema);

module.exports = OrderCounter;
