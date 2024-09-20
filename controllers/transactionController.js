// transactionController.js
const Statement = require("../models/statement.js");
const Transaction = require("../models/transaction.js");
const User = require("../models/user.js");

//SAGA PATTERN
const updateTransaction = async (transactionId, status) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw new Error("Transaction not found!");
  }
  transaction.status = status;
  return transaction.save();
};

const createStatement = async (transaction, balance) => {
  let newStatement;

  if (transaction.category === "payment") {
    newStatement = new Statement({
      particulars: transaction.description,
      quantity: 1,
      userId: transaction.userId,
      reference: transaction.reference,
      price: transaction.amount,
      date: transaction.transactionDate,
      type: "debit",
      credit: 0,
      debit: transaction.amount,
      balance: balance - parseFloat(transaction.amount),
    });
  } else if (transaction.category === "receipt") {
    newStatement = new Statement({
      // particulars: transaction.description,
      // quantity: 1,
      // userId: transaction.userId,
      // reference: transaction.reference,
      // price: transaction.amount,
      // date: transaction.transactionDate,
      // type: "credit",
      // credit: transaction.amount,
      // debit: 0,
      // balance: balance + parseFloat(transaction.amount),
    });
  } else {
    newStatement = new Statement({
      particulars: transaction.description,
      quantity: 1,
      userId: transaction.userId,
      reference: transaction.reference,
      price: transaction.amount,
      date: transaction.transactionDate,
      type: "debit",
      credit: 0,
      debit: transaction.amount,
      balance: balance - parseFloat(transaction.amount),
    });
  }

  return newStatement.save();
};

const updateUserWallet = async (userId, newBalance) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found!");
  }
  user.wallet = newBalance.toString();
  return user.save();
};

const compensate = async (transaction, newStatement, user, originalWallet) => {
  // Revert transaction status
  transaction.status = "pending"; // Assuming you keep track of previous status
  await transaction.save();

  // Revert statement
  await Statement.findByIdAndDelete(newStatement._id);

  // Revert user wallet
  user.wallet = originalWallet.toString();
  await user.save();
};

module.exports.createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    const savedTransaction = await transaction.save();
    res.status(201).json({ message: "Transaction created" }); // 201 Created
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      status: "pending",
      category: "payment",
    }).sort({
      transactionDate: -1,
    });

    res.status(200).json({
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.processUpdateTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const { status } = req.body;

  let transaction;
  let newStatement;
  let user;
  let originalWallet;

  try {
    // Step 1: Update Transaction
    transaction = await updateTransaction(transactionId, status);

    // Step 2: Get Current Statement
    const statement = await Statement.find({ userId: transaction.userId })
      .sort({ date: -1 })
      .limit(1);
    const balance = statement[0]?.balance || 0;

    // Step 3: Create Statement
    newStatement = await createStatement(transaction, balance);

    // Step 4: Update User Wallet
    user = await User.findById(transaction.userId);
    originalWallet = user.wallet;
    const newWallet = newStatement.balance;
    await updateUserWallet(user._id, newWallet);

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.log(error);

    // Compensate in case of failure
    if (transaction) {
      await compensate(transaction, newStatement, user, originalWallet);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getTransactionByCustomerId = async (req, res) => {
  const customerId = req.params.id;

  try {
    const transactions = await Transaction.find({ userId: customerId }).sort({
      transactionDate: -1,
    });
    if (!transactions) {
      return res.status(404).json({ message: "Transactions not found" });
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
  }
};
