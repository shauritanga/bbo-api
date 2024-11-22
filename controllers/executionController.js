const Execution = require("../models/execution.js");
const Order = require("../models/order.js");
const User = require("../models/user.js");

module.exports.getExecution = async (req, res) => {
  const id = req.params.id;
  try {
    const executions = await Execution.find({ order: id }).populate({
      path: "order",
      populate: [
        { path: "user", model: "User" },
        { path: "security", model: "Security" },
      ],
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

module.exports.getExecutionByClientId = async (req, res) => {
  const id = req.params.id;
  try {
    const executions = await Execution.find({
      user: id,
    }).populate({
      path: "order",
      populate: [
        { path: "user", model: "User" },
        { path: "security", model: "Security" },
      ],
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
