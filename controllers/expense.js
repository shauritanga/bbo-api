const Expense = require("../models/expense.js");

module.exports.getAllExpenses = async (req, res) => {
  const expenses = await Expense.find({}, { _id: 0, __v: 0 });
  if (!expenses) {
    return res.status(404).json({ message: "No expenses found" });
  }
  res.status(200).json(expenses);
};

module.exports.getExpenseMonthly = async (req, res) => {
  const month = req.query.month;
  const intMonth = parseInt(month);

  const startDate = new Date(2024, intMonth, 1);
  const endDate = new Date(2024, intMonth + 1, 0, 23, 59, 59);

  const expenses = await Expense.find(
    {
      date: { $gte: startDate, $lte: endDate },
    },
    { __v: 0 }
  );
  if (!expenses) {
    return res.status(404).json({ message: "No expenses found" });
  }
  res.status(200).json(expenses);
};
