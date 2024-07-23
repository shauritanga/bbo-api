const Execution = require("../models/execution.js");
const Order = require("../models/order.js");
const Transaction = require("../models/transaction.js");
module.exports.createExecution = async (req, res) => {
  //Validate inputs
  try {
    const { amount, date, customer, ...rest } = req.body;
    const execution = new Execution({
      amount,
      ...rest,
    });
    const executionResult = await execution.save();
    if (!executionResult) {
      return res
        .status(500)
        .json({ success: false, message: "Ooops! something went wrong" });
    }
    const id = req.body.order;
    const vol = req.body.executed;
    const orders = await Order.findOneAndUpdate(
      { uid: id },
      { $inc: { executed: vol } }
    );

    res.status(200).json({ success: true, data: executionResult });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getExecution = async (req, res) => {
  const id = req.params.id;
  try {
    const executions = await Execution.find({ order: id });

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
