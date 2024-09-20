const Transaction = require("../models/transaction.js");
const User = require("../models/user.js");
const Statement = require("../models/statement.js");

//SAGA PATTERN
const createReceipt = async (transactionData) => {
  const receipt = new Transaction(transactionData);
  const respo = await receipt.save();
  return respo;
};

const createStatement = async (statementData) => {
  const newStatement = new Statement(statementData);
  await newStatement.save();
  return newStatement;
};

const updateUserWallet = async (userId, newWalletAmount) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.wallet = newWalletAmount.toString();
  await user.save();
};

// Compensating actions
const compensate = async (receipt, statement, user, originalWallet) => {
  // Revert receipt
  await Transaction.findByIdAndDelete(receipt._id);

  // Revert statement
  if (statement) {
    await Statement.findByIdAndDelete(statement._id);
  }

  // Revert user wallet
  if (user) {
    user.wallet = originalWallet.toString();
    await user.save();
  }
};

module.exports.processReceiptCreation = async (req, res) => {
  const {
    date,
    amount,
    reference,
    description,
    accountId,
    userId,
    paymentMethodId,
  } = req.body;

  let receipt;
  let newStatement;
  let user;
  let originalWallet;

  try {
    // Step 1: Create Receipt
    receipt = await createReceipt({
      transactionDate: date,
      amount,
      debit: amount,
      credit: 0,
      reference,
      category: "receipt",
      action: "credit",
      description,
      accountId,
      userId,
      orderId: "",
      paymentMethodId,
    });

    // Step 2: Get Current Statement
    const statement = await Statement.find({ userId })
      .sort({ date: -1 })
      .limit(1);
    const balance = statement[0]?.balance || 0;

    // Step 3: Create Statement
    newStatement = await createStatement({
      particulars: description,
      quantity: 1,
      userId,
      reference,
      price: parseFloat(amount),
      date,
      type: "credit",
      credit: parseFloat(amount),
      debit: 0,
      balance: balance + parseFloat(amount),
    });

    // Step 4: Update User Wallet
    user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }
    originalWallet = user.wallet;
    const newWallet = balance + parseFloat(amount);
    await updateUserWallet(userId, newWallet);

    res.status(201).json({ message: "Receipt created successfully" });
  } catch (error) {
    console.error("Error occurred:", error);

    // Compensate in case of failure
    await compensate(receipt, newStatement, user, originalWallet);

    res.status(500).json({ message: "Failed to create receipt" });
  }
};

module.exports.getAllReceipts = async (req, res) => {
  try {
    const receipts = await Transaction.find({ category: "receipt" }).sort({
      transactionDate: -1,
    });
    if (!receipts)
      return res.status(404).json({ message: "No receipts found" });
    res.status(200).json(receipts);
  } catch (error) {}
};

module.exports.getReceiptMonthly = async (req, res) => {
  const month = req.query.month;
  const intMonth = parseInt(month);

  const startDate = new Date(2024, intMonth, 1);
  const endDate = new Date(2024, intMonth + 1, 0, 23, 59, 59);

  const receipts = await Transaction.find(
    {
      transactionDate: { $gte: startDate, $lte: endDate },
    },
    { __v: 0 }
  );
  if (!receipts) return res.status(404).json({ message: "No receipts found" });
  res.status(200).json(receipts);
};
