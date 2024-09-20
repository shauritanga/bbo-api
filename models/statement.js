const mongoose = require("mongoose");
const statementSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    particulars: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    debit: {
      type: Number,
      required: true,
    },
    credit: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Statement = mongoose.model("Statement", statementSchema);
module.exports = Statement;
