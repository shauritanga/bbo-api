const Order = require("../models/order.js");

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
      userId,
      date,
      volume,
      price,
      amount,
      type,
      securityId,
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

    console.log(updatedOrder);
    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Order updated failed, try again" });
  }
};

module.exports.adminDeleteOrder = async (req, res) => {
  const id = req.params.id;
  try {
    await Order.findOneAndDelete({ _id: id });
    res.status(200).json({ message: "Order deleted successful" });
  } catch (error) {}
};

module.exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const foundOrder = await Order.findById(id);
    res.status(200).json(foundOrder);
  } catch (error) {
    console.log(error);
  }
};
module.exports.getPendingOrders = async (req, res) => {};
module.exports.getCompleteOrders = async (req, res) => {};
module.exports.getUnderProcessOrders = (req, res) => {};
