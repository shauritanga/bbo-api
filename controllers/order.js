const Order = require("../models/order.js");

module.exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    const skip = (page - 1) * limit; // skip

    const orders = await Order.find({})
      .populate("customer")
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
module.exports.getPendingOrders = async (req, res) => {};
module.exports.getCompleteOrders = async (req, res) => {};
module.exports.getUnderProcessOrders = (req, res) => {};
