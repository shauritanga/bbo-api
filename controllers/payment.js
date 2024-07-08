const Payment = require("../models/payment.js");
module.exports.getAllPayments = async (req, res) => {
  const payments = await Payment.find({}, { __v: 0 });
  if (!payments) return res.status(404).json({ message: "No receipts found" });
  res.json(payments);
};
module.exports.getAllPaymentMonthly = async (req, res) => {
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
