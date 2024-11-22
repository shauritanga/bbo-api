const Execution = require("../models/execution.js");
const Order = require("../models/order.js");
const Transaction = require("../models/transaction.js");

//Delete all order executions
async function deleteExecutions(orderId) {
  return await Execution.deleteMany({ order: orderId });
}

//Compasete delete if fail
async function compaseteDeleteExecutions(executions, deleteRes) {
  if (deleteRes > 0) {
    for (const exec of executions) {
      await Execution.create(exec);
    }
  }
}

//Delete all order transactions
async function deleteTransaction(orderId) {
  return await Transaction.deleteMany({ order: orderId });
}

//compasete delete if fail
async function compaseteDeleteTransactions(transactions, deleteRes) {
  if (deleteRes > 0) {
    for (const trans of transactions) {
      await Transaction.create(trans);
    }
  }
}

//delete order
async function deleteOrder(orderId) {
  return await Order.findByIdAndDelete(orderId);
}

//compasete order delete
async function compaseteOrderDelete(order, deleteRes) {
  if (deleteRes > 0) {
    await Order.create(order);
  }
}

module.exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    const skip = (page - 1) * limit; // skip

    const orders = await Order.find({})
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const totalDocuments = await Order.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    res.status(200).json({
      data: orders,
      currentPage: page,
      totalPages: totalPages,
      totalDocuments: totalDocuments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.createOrder = async (req, res) => {
  const {
    userId,
    volume,
    type,
    price,
    totalFees,
    securityId,
    date,
    amount,
    holding,
  } = req.body;
  try {
    const order = Order({
      user: userId,
      date,
      volume,
      price,
      amount,
      type,
      security: securityId,
      holding,
      totalFees,
    });
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.adminUpdateOrder = async (req, res) => {
  const orderId = req.params.id;
  const updateData = req.body;

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      updateData,
      {
        new: true,
      }
    );

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Order updated failed, try again" });
  }
};

module.exports.adminDeleteOrder = async (req, res) => {
  const id = req.params.id;

  let executiosToRestore;
  let orderData;
  let transactionsToRestore;
  let executionDeleteRes;
  let transactionDeleteRes;
  let orderDeleteRes;

  try {
    executiosToRestore = await Execution.find({ order: id });
    orderData = await Order.findById(id);
    transactionsToRestore = await Transaction.find({ order: id });

    //delete all executions
    executionDeleteRes = await deleteExecutions(id);
    transactionDeleteRes = await deleteTransaction(id);
    orderDeleteRes = await deleteOrder(id);
    res.status(200).json({ message: "You have successfully delete an order" });
  } catch (error) {
    console.log(error);
    await compaseteDeleteExecutions(executiosToRestore, executionDeleteRes);
    await compaseteDeleteTransactions(
      transactionsToRestore,
      transactionDeleteRes
    );
    await compaseteOrderDelete(orderData, orderDeleteRes);
    res.status(500).json({ message: "Order delete failed, try again" });
  }
};

module.exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const foundOrder = await Order.findById(id).populate([
      { path: "user", model: "User" },
      { path: "security", model: "Security" },
    ]);
    res.status(200).json(foundOrder);
  } catch (error) {
    console.log(error);
  }
};
module.exports.getPendingOrders = async (req, res) => {};
module.exports.getCompleteOrders = async (req, res) => {};
module.exports.getUnderProcessOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $expr: {
        $gt: ["$volume", "$executed"],
      },
    }).populate([
      { path: "user", model: "User" },
      { path: "security", model: "Security" },
    ]);
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({message:"Something went wrong, try again"})
  }
};
