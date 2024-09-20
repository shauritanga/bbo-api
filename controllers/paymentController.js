const Transaction = require("../models/transaction");
const { validationResult } = require("express-validator");
const getAllPayments = async (req, res) => {
  const payments = await Payment.find({}, { __v: 0 });
  if (!payments) return res.status(404).json({ message: "No receipts found" });
  res.json(payments);
};

const createPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    date,
    amount,
    reference,
    description,
    accountId,
    userId,
    paymentMethodId,
  } = req.body;

  try {
    const payment = Transaction({
      transactionDate: date,
      amount,
      debit: amount,
      credit: 0,
      reference,
      category: "payment",
      action: "debit",
      description,
      accountId,
      userId,
      orderId: "",
      paymentMethodId,
    });
    await payment.save();
    res
      .status(201)
      .json({ message: "Payment created you may appprove or reject" });
  } catch (error) {
    res.status(500).json({ meaage: error.message });
  }
};

const getAllPaymentMonthly = async (req, res) => {
  const month = req.query.month;
  const intMonth = parseInt(month);

  const startDate = new Date(2024, intMonth, 1);
  const endDate = new Date(2024, intMonth + 1, 0, 23, 59, 59);

  const receipts = await Payment.find(
    {
      date: { $gte: startDate, $lte: endDate },
    },
    { __v: 0 }
  );
  if (!receipts) return res.status(404).json({ message: "No receipts found" });
  res.json(receipts);
};

module.exports = { getAllPayments, getAllPaymentMonthly, createPayment };
