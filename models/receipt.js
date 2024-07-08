const mongoose = require("mongoose");
const ReceiptCounter = require("./counter/receiptCounter.js");
const receiptSchema = mongoose.Schema({
  receiptId: { type: String, unique: true },
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
  reference: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
  },
});

receiptSchema.pre("save", async function (next) {
  if (this.isNew) {
    const receiptCounter = await ReceiptCounter.findByIdAndUpdate(
      { _id: "transactionId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seq = String(receiptCounter.seq).padStart(5, "0");
    this.receiptId = `REC${seq}`;
  }
  next();
});

const Receipt = mongoose.model("Receipt", receiptSchema);
module.exports = Receipt;
