const mongoose = require("mongoose");
const TransactionCounter = require("./counter/transactionCounter.js");

const transactionSchema = new mongoose.Schema(
  {
    id: { type: String },
    transaction_date: { type: Date, default: Date.now },
    auto: { type: String },
    title: { type: String },
    amount: { type: String },
    withdraw_account: { type: String },
    cash_account: { type: String },
    debit: { type: String },
    credit: { type: String },
    reference: { type: String },
    category: { type: String },
    action: { type: String },
    description: { type: String },
    status: { type: String },
    account_id: { type: String },
    class_id: { type: String },
    client_id: { type: String },
    financial_year_id: { type: String },
    order_id: { type: String },
    reconciled: { type: String },
    uid: { type: String },
    values: { type: String },
    payment_method_id: { type: String },
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
