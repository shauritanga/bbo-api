const Expense = require("../models/expense.js");
const Transaction = require("../models/transaction.js");

module.exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Transaction.find({ category: "expenses" });
    console.log(expenses);
    res.status(200).json(expenses);
  } catch (error) {}
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
