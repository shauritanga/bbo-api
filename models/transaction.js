const mongoose = require("mongoose");
const TransactionCounter = require("./counter/transactionCounter.js");

const transactionSchema = new mongoose.Schema(
  {
    id: { type: String },
    transactionDate: { type: Date, default: Date.now },
    amount: { type: String },
    debit: { type: String },
    credit: { type: String },
    reference: { type: String },
    category: { type: String },
    action: { type: String },
    description: { type: String },
    status: { type: String, default: "pending" },
    accountId: { type: String },
    userId: { type: String },
    orderId: { type: String },
    uid: { type: String },
    paymentMethodId: { type: String, required: false },
  },
  { timestamps: true }
);

transactionSchema.pre("save", async function (next) {
  if (this.isNew) {
    const transactionCounter = await TransactionCounter.findByIdAndUpdate(
      { _id: "uid" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seq = String(transactionCounter.seq).padStart(4, "0");
    this.uid = `ATX${seq}`;
  }
  next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
