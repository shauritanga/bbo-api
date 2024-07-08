const Execution = require("../models/execution.js");
const Order = require("../models/order.js");
module.exports.createExecution = async (req, res) => {
  //Validate inputs
  try {
    const execution = new Execution({
      ...req.body,
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
      { _id: id },
      { $inc: { balance: -vol } }
    );
    console.log(orders);
    res.status(200).json({ success: true, data: executionResult });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getExecution = async (req, res) => {
  const id = req.params.id;
  try {
    const executions = await Execution.find({ order: id }).populate("customer");
    console.log(executions);
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
  const { customerId } = req.query;
  try {
    const executions = await Execution.find({ customer: customerId })
      .populate("customer")
      .populate("order");
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
