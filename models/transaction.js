const mongoose = require("mongoose");
const TransactionCounter = require("./counter/transactionCounter.js");

const transactionSchema = new mongoose.Schema(
  {
    transactionDate: { type: Date, default: Date.now },
    settlementDate: { type: Date },
    amount: { type: Number },
    quantity: { type: Number },
    price: { type: Number },
    debit: { type: Number },
    credit: { type: Number },
    reference: { type: String, unique: true },
    category: { type: String },
    action: { type: String },
    description: { type: String },
    status: { type: String, default: "pending" },
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    uid: { type: String },
    paymentMethodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
    },
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
