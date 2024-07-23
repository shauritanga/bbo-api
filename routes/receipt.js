const express = require("express");
const Receipt = require("../models/receipt.js");
const {
  getAllReceipts,
  getReceiptMonthly,
} = require("../controllers/receipts.js");
const Transaction = require("../models/transaction.js");
const route = express.Router();

route.get("/all", getAllReceipts);
route.get("/monthly", getReceiptMonthly);

route.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    const receipts = await Transaction.find({ category: "receipt" })
      .skip(skip)
      .limit(limit);

    const totalDocuments = await receipts.length;
    const totalPages = Math.ceil(totalDocuments / limit);

    res.status(200).json({
      data: receipts,
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
    date,
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
    const receipt = Transaction({
      title: description,
      amount,
      transaction_date: date,
      category,
      account_id,
      client_id,
      reference,
      status,
      payment_method_id,
      description,
    });
    await receipt.save();
    res.status(201).json({ message: "Receipt created successfully" });
  } catch (error) {}
});

route.get("/:id", async (req, res) => {
  const receipt = await Receipt.find({ _id: req.params.id });
  res.send(receipt);
});

route.post("/:id", async (req, res) => {
  const response = await Receipt.updateOne(
    { _id: req.params.id },
    { ...req.body }
  );
  res.send(response.acknowledged);
});

route.delete("/:id", async (req, res) => {
  const receipt = await Receipt.findByIdAndDelete(req.params.id);
  res.send(receipt);
});

module.exports = route;
