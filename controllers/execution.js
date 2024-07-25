const { default: mongoose } = require("mongoose");
const Execution = require("../models/execution.js");
const Order = require("../models/order.js");
const Transaction = require("../models/transaction.js");
module.exports.createExecution = async (req, res) => {
  //Validate inputs

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { amount, trading_date, customer, slip, type, ...rest } = req.body;
    const execution = new Execution({
      amount,
      trading_date,
      slip,
      ...rest,
    });
    const executionResult = await execution.save({ session });
    if (!executionResult) {
      return res
        .status(500)
        .json({ success: false, message: "Ooops! something went wrong" });
    }
    const id = req.body.order_id;
    const vol = req.body.executed;
    const result = await Order.findOneAndUpdate(
      { uid: id },
      { $inc: { executed: vol } },
      { session }
    );

    const transaction = Transaction({
      title: "processing an order",
      credit: type.toLowerCase() == "sell" ? amount : 0,
      debit: type.toLowerCase() === "buy" ? amount : 0,
      description: "processing an order",
      transaction_date: trading_date,
      reference: slip,
      category: "order",
      action: type.toLowerCase() === "buy" ? "debit" : "credit",
      status: "new",
      client_id: customer,
      account_id: action,
      order_id: id,
    });

    await transaction.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res
      .status(500)
      .json({ message: "There was an error on saving data, try again" });
  }
};

module.exports.getExecution = async (req, res) => {
  const id = req.params.id;
  try {
    const executions = await Execution.find({ order_id: id });

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
