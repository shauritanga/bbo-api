const mongoose = require("mongoose");
const ExpenseCounter = require("./counter/expenseCounter.js");

const expenseSchema = mongoose.Schema({
  expenseId: { type: String, unique: true },
  date: {
    type: Date,
    default: Date.now,
  },
  payee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  checkNumber: {
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
  description: {
    type: String,
  },
  status: {
    type: String,
  },
});

expenseSchema.pre("save", async function (next) {
  if (this.isNew) {
    const expenseCounter = await ExpenseCounter.findByIdAndUpdate(
      { _id: "expenseId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seq = String(expenseCounter.seq).padStart(5, "0");
    this.expenseId = `AEX${seq}`;
  }
  next();
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
