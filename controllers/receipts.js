const Receipt = require("../models/receipt.js");
module.exports.getAllReceipts = async (req, res) => {
  const receipts = await Receipt.find({}, { __v: 0 });
  if (!receipts) return res.status(404).json({ message: "No receipts found" });
  res.json(receipts);
};

module.exports.getReceiptMonthly = async (req, res) => {
  const month = req.query.month;
  const intMonth = parseInt(month);

  const startDate = new Date(2024, intMonth, 1);
  const endDate = new Date(2024, intMonth + 1, 0, 23, 59, 59);

  const receipts = await Receipt.find(
    {
      date: { $gte: startDate, $lte: endDate },
    },
    { __v: 0 }
  );
  if (!receipts) return res.status(404).json({ message: "No receipts found" });
  res.json(receipts);
};
