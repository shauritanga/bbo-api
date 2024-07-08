const mongoose = require("mongoose");
const TransactionCounter = require("./counter/transactionCounter.js");

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true },
  type: { type: String, enum: ["expense", "payment"], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // Optional
  payee: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, // For expenses
  method: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod" }, // e.g., 'cash', 'credit card', 'check'
  referenceNumber: String, // (Optional, e.g., check number)
  status: String,
});

transactionSchema.pre("save", async function (next) {
  if (this.isNew) {
    const transactionCounter = await TransactionCounter.findByIdAndUpdate(
      { _id: "transactionId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seq = String(transactionCounter.seq).padStart(5, "0");
    this.transactionId = `ATX${seq}`;
  }
  next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
