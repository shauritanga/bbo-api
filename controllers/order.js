const Order = require("../models/order.js");
const calculateFees = require("../utils/getFees.js");

module.exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    const skip = (page - 1) * limit; // skip

    const orders = await Order.find({})
      // .sort({ createdAt: -1 })
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
  let {
    dse,
    vat,
    brokerage,
    cds,
    cmsa,
    fidelity,
    total_commissions,
    amount,
    volume,
    ...rest
  } = req.body;
  dse = calculateFees(amount).dseFee;
  vat = calculateFees(amount).vat;
  brokerage = calculateFees(amount).totalCommission;
  cds = calculateFees(amount).cdsFee;
  cmsa = calculateFees(amount).cmsaFee;
  fidelity = calculateFees(amount).fidelityFee;
  total_commissions = calculateFees(amount).totalCharges;
  try {
    const order = Order({
      vat,
      brokerage,
      cds,
      cmsa,
      fidelity,
      total_commissions,
      dse,
      amount,
      volume,
      ...rest,
    });
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {}
};
module.exports.getPendingOrders = async (req, res) => {};
module.exports.getCompleteOrders = async (req, res) => {};
module.exports.getUnderProcessOrders = (req, res) => {};
