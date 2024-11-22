// transactionController.js
const Transaction = require("../models/transaction.js");
const Execution = require("../models/execution.js");
const Order = require("../models/order.js");
const User = require("../models/user.js");
const calculateFees = require("../utils/getFees.js");

//Update transaction
const updateTransaction = async (filter, update) => {
  const updatedTransaction = await Transaction.findOneAndUpdate(
    filter,
    update,
    { new: true }
  ).populate("order");
  return updatedTransaction;
};

// Define each step
const createExecution = async (executionData) => {
  const execution = new Execution(executionData);
  return execution.save();
};

//Update order
const updateOrder = async (orderId, executedVolume) => {
  return Order.findOneAndUpdate(
    { _id: orderId },
    { $inc: { executed: executedVolume } },
    { new: true }
  );
};

//Update user wallet
const updateUserWallet = async (userId, newWalletAmount) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.wallet = newWalletAmount.toString();
  return user.save();
};

//Rollback
const compensate = async (execution, transaction, user, originalWallet) => {
  // Revert Execution
  if (execution) {
    await Execution.findByIdAndDelete(execution._id);
  }

  // Revert Order (if necessary, specific compensation logic might be needed)
  if (execution) {
    await Order.findByIdAndUpdate(execution.order, {
      $inc: { executed: -execution?.executed || 0 },
    });
  }

  // Revert Transaction
  if (transaction) {
    await Transaction.findByIdAndUpdate(transaction._id, { status: "pending" });
  }

  // Revert User Wallet
  if (user) {
    user.wallet = originalWallet.toString();
    await user.save();
  }
};

const createTransaction = async (req, res) => {
  const data = req.body;
  try {
    let transaction;
    if (data.category === "payment") {
      transaction = Transaction({
        transactionDate: data.date,
        settlementDate: data.date,
        amount: data.amount,
        debit: data.amount,
        quantity: 1,
        price: data.amount,
        credit: 0.0,
        reference: data.reference,
        category: data.category,
        action: "debit",
        description: data.description,
        account: data.accountId,
        user: data.userId,
        orderId: "",
        createdBy: req.user._id,
      });
    } else if (data.category === "expense") {
      transaction = Transaction({
        transactionDate: data.transactionDate,
        settlementDate: data.transactionDate,
        amount: data.amount,
        debit: data.amount,
        credit: 0.0,
        reference: data.reference,
        category: data.category,
        action: "debit",
        description: data.description,
        accountId: data.accountId,
        userId: "",
        orderId: "",
        createdBy: req.user._id,
      });
    } else if (data.category === "receipt") {
      transaction = Transaction({
        transactionDate: data.date,
        settlementDate: data.date,
        amount: data.amount,
        quantity: 1,
        price: data.amount,
        debit: 0.0,
        credit: data.amount,
        reference: data.reference,
        category: data.category,
        action: "credit",
        description: data.description,
        account: data.accountId,
        user: data.userId,
        orderId: "",
        createdBy: req.user._id,
      });
    } else {
      transaction = Transaction({
        amount: data.amount,
        credit:
          data.type.toLowerCase() === "sell"
            ? parseFloat(data.amount) - calculateFees(data.amount).totalCharges
            : 0,
        debit:
          data.type.toLowerCase() === "buy"
            ? calculateFees(data.amount).totalConsideration
            : 0,
        description:
          data.type.toLowerCase() === "buy"
            ? `purchases of ${data.security?.name} shares`
            : `sales of ${data.security?.name} shares`,
        transactionDate: data.tradingDate,
        settlementDate: data.settlementDate,
        quantity: data.executed,
        price: data.price,
        reference: data.slip,
        category: "order",
        action: data.type.toLowerCase() === "buy" ? "debit" : "credit",
        user: data.userId,
        order: data.orderId,
        createdBy: req.user._id,
      });
    }
    await transaction.save();
    res.status(201).json({ message: "Transaction successfully created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      status: { $in: ["disapproved", "pending"] },
    })
      .sort({
        transactionDate: -1,
      })
      .populate("user");

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveTransaction = async (req, res) => {
  const { status } = req.body;
  const transactionId = req.params.id;
  let updatedTransaction;
  let execution;
  let updatedOrder;
  let user;
  let originalWallet;
  try {
    const filter = { _id: transactionId };

    const update = { status, approvedBy: req.user._id };

    updatedTransaction = await updateTransaction(filter, update);
    if (status.toLowerCase() === "approved") {
      if (updatedTransaction?.category === "order") {
        execution = await createExecution({
          tradingDate: updatedTransaction.transactionDate,
          settlementDate: updatedTransaction.settlementDate,
          slip: updatedTransaction.reference,
          type: updatedTransaction.action === "debit" ? "buy" : "sell",
          order: updatedTransaction.order,
          user: updatedTransaction.user,
          price: updatedTransaction.price,
          executed: updatedTransaction.quantity,
          amount: updatedTransaction.amount,
          payout:
            updatedTransaction.action === "debit"
              ? calculateFees(updatedTransaction.amount).totalConsideration
              : updatedTransaction.amount -
                calculateFees(updatedTransaction.amount).totalCharges,
          totalComission: calculateFees(updatedTransaction.amount)
            .totalCommission,
          brokerage: calculateFees(updatedTransaction.amount).totalCommission,
          vat: calculateFees(updatedTransaction.amount).vat,
          fidelity: calculateFees(updatedTransaction.amount).fidelityFee,
          cmsa: calculateFees(updatedTransaction.amount).cmsaFee,
          cds: calculateFees(updatedTransaction.amount).cdsFee,
          dse: calculateFees(updatedTransaction.amount).dseFee,
          total: calculateFees(updatedTransaction.amount).totalConsideration,
        });

        updatedOrder = await updateOrder(execution.order, execution.executed);

        user = await User.findById(updatedTransaction.user);
        if (!user) {
          throw new Error("User not found!");
        }

        originalWallet = user.wallet;
        const newWallet =
          execution.type.toLowerCase() === "buy"
            ? user.wallet - execution.payout
            : user.wallet + execution.payout;

        await updateUserWallet(updatedTransaction.user, newWallet);
      } else if (updatedTransaction.category === "receipt") {
        user = await User.findById(updatedTransaction.user);
        if (!user) {
          throw new Error("User not found!");
        }
        originalWallet = user.wallet;
        const newWallet = user.wallet + updatedTransaction.amount;
        await updateUserWallet(updatedTransaction.user, newWallet);
      } else {
        user = await User.findById(updatedTransaction.user);
        if (!user) {
          throw new Error("User not found!");
        }

        originalWallet = user.wallet;
        const newWallet = user.wallet - updatedTransaction.amount;

        await updateUserWallet(updatedTransaction.user, newWallet);
      }
      res.status(200).json({ message: "Transaction successfully approved" });
    } else {
      res.status(200).json({ message: "Transaction successfully disapproved" });
    }
  } catch (error) {
    console.log(error);
    await compensate(execution, updatedTransaction, user, originalWallet);
    res.status(500).json({ message: error.message });
  }
};

const getTransactionByCustomerId = async (req, res) => {
  const customerId = req.params.id;

  try {
    const transactions = await Transaction.find({ user: customerId })
      .sort({
        transactionDate: -1,
      })
      .populate("user");
    if (!transactions) {
      return res.status(404).json({ message: "Transactions not found" });
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
  }
};

const getTransactionAsStatementsByCustomerId = async (req, res) => {
  const customerId = req.params.id;
  const { from, to } = req.query;
  const start = new Date(from);
  const end = new Date(to);

  try {
    const transactions = await Transaction.find({
      user: customerId,
      status: "approved",
      transactionDate: {
        $gte: start,
        $lte: end,
      },
    })
      .sort({
        transactionDate: 1,
      })
      .populate("user");

    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
  }
};

const getReceiptTransactions = async (req, res) => {
  try {
    const receiptTransactions = await Transaction.find({
      category: "receipt",
    })
      .sort({ transactionDate: -1 })
      .populate("user");

    res.status(200).json(receiptTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getExpenseTransactions = async (req, res) => {
  try {
    const expenseTransactions = await Transaction.find({
      category: "expense",
    }).sort({ transactionDate: -1 });
    res.status(200).json(expenseTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentTransactions = async (req, res) => {
  try {
    const paymentTransactions = await Transaction.find({
      category: "payment",
    })
      .sort({ transactionDate: -1 })
      .populate("user");
    res.status(200).json(paymentTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getExpenseTransactions,
  getPaymentTransactions,
  getReceiptTransactions,
  getTransactionByCustomerId,
  getTransactionAsStatementsByCustomerId,
  approveTransaction,
};
