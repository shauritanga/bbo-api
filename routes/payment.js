const express = require("express");
const Payment = require("../models/payment.js");
const {
  getAllPaymentMonthly,
  getAllPayments,
} = require("../controllers/payment.js");
const route = express.Router();

route.get("/all", getAllPayments);
route.get("/monthly", getAllPaymentMonthly);

route.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    const payments = await Payment.find({}, { __v: 0 })
      .populate("payee")
      .skip(skip)
      .limit(limit);

    const totalDocuments = await Payment.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    res.status(200).json({
      data: payments,
      currentPage: page,
      totalPages: totalPages,
      totalDocuments: totalDocuments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
route.post("/", async (req, res) => {
  const payment = Payment({
    ...req.body,
  });
  try {
    const response = await payment.save();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

route.get("/:id", async (req, res) => {
  const payment = await Payment.find({ _id: req.params.id });
  res.send(payment);
});

route.post("/:id", async (req, res) => {
  const response = await Payment.updateOne(
    { _id: req.params.id },
    { ...req.body }
  );
  res.send(response);
});

route.delete("/:id", async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  res.send(payment);
});

module.exports = route;
