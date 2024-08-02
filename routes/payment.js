const express = require("express");
const Payment = require("../models/payment.js");
const {
  getAllPaymentMonthly,
  getAllPayments,
} = require("../controllers/payment.js");
const Transaction = require("../models/transaction.js");
const route = express.Router();

route.get("/all", getAllPayments);
route.get("/monthly", getAllPaymentMonthly);

route.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    const payments = await Transaction.find({ category: "payment" })
      .skip(skip)
      .limit(limit);

    console.log(payments);

    const totalDocuments = (await Transaction.find({ category: "payment" }))
      .length;
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
  const {
    transaction_date,
    amount,
    reference,
    category,
    description,
    status,
    account_id,
    client_id,
    payment_method_id,
  } = req.body;

  try {
    const payment = Transaction({
      title: description,
      amount,
      transaction_date,
      category,
      account_id,
      client_id,
      reference,
      status,
      payment_method_id,
      description,
    });
    console.log(payment);
    const resi = await payment.save();
    console.log(resi);
    res.status(201).json({ message: "Receipt created successfully" });
  } catch (error) {
    console.log(error);
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
