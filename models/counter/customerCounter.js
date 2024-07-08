const mongoose = require("mongoose");

const customerCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const CustomerCounter = mongoose.model(
  "CustomerCounter",
  customerCounterSchema
);

module.exports = CustomerCounter;
