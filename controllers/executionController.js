const { default: mongoose } = require("mongoose");
const Execution = require("../models/execution.js");
const Order = require("../models/order.js");
const Transaction = require("../models/transaction.js");
const Statement = require("../models/statement.js");
const User = require("../models/user.js");

// Define each step
const createExecution = async (executionData) => {
  const execution = new Execution(executionData);
  return execution.save();
};

const updateOrder = async (orderId, executedVolume) => {
  return Order.findOneAndUpdate(
    { _id: orderId },
    { $inc: { executed: executedVolume } },
    { new: true }
  );
};

const createTransaction = async (transactionData) => {
  const transaction = new Transaction(transactionData);
  return transaction.save();
};

const createStatement = async (statementData) => {
  const newStatement = new Statement(statementData);
  return newStatement.save();
};

const updateUserWallet = async (userId, newWalletAmount) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.wallet = newWalletAmount.toString();
  return user.save();
};

const compensate = async (
  execution,
  transaction,
  statement,
  user,
  originalWallet
) => {
  // Revert Execution
  if (execution) {
    await Execution.findByIdAndDelete(execution._id);
  }

  // Revert Order (if necessary, specific compensation logic might be needed)
  if (transaction) {
    await Order.findByIdAndUpdate(transaction.orderId, {
      $inc: { executed: -execution?.executed || 0 },
    });
  }

  // Revert Transaction
  if (transaction) {
    await Transaction.findByIdAndDelete(transaction._id);
  }

  // Revert Statement
  if (statement) {
    await Statement.findByIdAndDelete(statement._id);
  }

  // Revert User Wallet
  if (user) {
    user.wallet = originalWallet.toString();
    await user.save();
  }
};

module.exports.processExecutionCreation = async (req, res) => {
  const {
    price,
    orderId,
    amount,
    security,
    tradingDate,
    settlementDate,
    executed,
    userId,
    slip,
    type,
    total,
    ...rest
  } = req.body;

  let execution;
  let updatedOrder;
  let transaction;
  let newStatement;
  let user;
  let originalWallet;
  try {
    // Step 1: Create Execution
    execution = await createExecution({
      amount,
      userId,
      orderId,
      type,
      slip,
      executed: parseFloat(executed),
      tradingDate,
      settlementDate,
      price: parseFloat(price),
      payout: total,
      ...rest,
    });

    // Step 2: Update Order
    updatedOrder = await updateOrder(orderId, parseInt(executed));

    // Step 3: Create Transaction
    transaction = await createTransaction({
      credit: type.toLowerCase() === "sell" ? amount : 0,
      debit: type.toLowerCase() === "buy" ? amount : 0,
      description:
        type.toLowerCase() === "buy"
          ? `purchases ${security} shares`
          : `sales ${security} shares`,
      transactionDate: tradingDate,
      reference: slip,
      category: "order",
      action: type.toLowerCase() === "buy" ? "debit" : "credit",
      status: "approved",
      userId: userId,
      orderId: orderId,
    });

    // Step 4: Create Statement
    const statement = await Statement.find({ userId })
      .sort({ date: -1 })
      .limit(1);
    const balance = statement[0]?.balance || 0;

    newStatement = await createStatement({
      particulars:
        type.toLowerCase() === "buy"
          ? `purchases ${security} shares`
          : `sales ${security} shares`,
      quantity: executed,
      userId,
      reference: slip,
      price,
      date: tradingDate,
      type: type.toLowerCase() === "buy" ? "debit" : "credit",
      credit: type.toLowerCase() === "sell" ? total : 0,
      debit: type.toLowerCase() === "buy" ? total : 0,
      balance:
        type.toLowerCase() === "buy"
          ? balance - parseFloat(total)
          : balance + parseFloat(total),
    });

    // Step 5: Update User Wallet
    user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }
    originalWallet = user.wallet;
    const newWallet =
      type.toLowerCase() === "buy"
        ? parseFloat(user.wallet) - total
        : parseFloat(user.wallet) + total;
    await updateUserWallet(userId, newWallet);

    res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    // Compensate in case of failure
    console.log(error);
    await compensate(
      execution,
      transaction,
      newStatement,
      user,
      originalWallet
    );
    res.status(500).json({ message: "Failed to process order" });
  }
};

module.exports.getExecution = async (req, res) => {
  const id = req.params.id;
  try {
    const executions = await Execution.find({ orderId: id });

    if (!executions) {
      return res
        .status(404)
        .json({ success: false, message: "Execution not found" });
    }
    res.status(200).json(executions);
  } catch (error) {
    console.log(error);
  }
};

module.exports.getExecutionByClientId = async (req, res) => {
  const id = req.params.id;
  try {
    const executions = await Execution.find({
      client_id: id,
      status: "approved",
    });

    if (!executions) {
      return res
        .status(404)
        .json({ success: false, message: "Execution not found" });
    }
    res.status(200).json(executions);
  } catch (error) {
    console.log(error);
  }
};

module.exports.getAllExecutions = async (req, res) => {
  const { orderId } = req.query;
  try {
    const executions = await Execution.find({ order: orderId });
    if (!executions) {
      return res
        .status(404)
        .json({ success: false, message: "Execution not found" });
    }
    res.status(200).json(executions);
  } catch (error) {
    console.log(error);
  }
};

module.exports.getOrderExecutions = async (req, res) => {
  const { id } = req.params;
  console.log(id);
};
