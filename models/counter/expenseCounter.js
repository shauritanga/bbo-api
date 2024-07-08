const mongoose = require("mongoose");

const expenseCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const ExpenseCounter = mongoose.model("ExpenseCounter", expenseCounterSchema);

module.exports = ExpenseCounter;
