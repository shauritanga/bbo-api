const express = require("express");
const Receipt = require("../models/receipt.js");
const Statement = require("../models/statement.js");
const User = require("../models/user.js");
const {
  getAllReceipts,
  getReceiptMonthly,
  processReceiptCreation,
} = require("../controllers/receiptController.js");
const Transaction = require("../models/transaction.js");
const route = express.Router();

route.get("/all", getAllReceipts);
route.get("/monthly", getReceiptMonthly);

// route.get("/", async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Default to page 1
//     const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

//     const skip = (page - 1) * limit; // Calculate the number of documents to skip

//     const receipts = await Transaction.find({ category: "receipt" })
//       .skip(skip)
//       .limit(limit);

//     const totalDocuments = (await Transaction.find({ category: "receipt" }))
//       .length;
//     const totalPages = Math.ceil(totalDocuments / limit);

//     res.status(200).json({
//       data: receipts,
//       currentPage: page,
//       totalPages: totalPages,
//       totalDocuments: totalDocuments,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

route.post("/", processReceiptCreation);
// route.post("/", async (req, res) => {
//   const {
//     date,
//     amount,
//     reference,
//     description,
//     accountId,
//     userId,
//     paymentMethodId,
//   } = req.body;

//   try {
//     const receipt = Transaction({
//       transactionDate: date,
//       amount,
//       debit: amount,
//       credit: 0,
//       reference,
//       category: "receipt",
//       action: "credit",
//       description,
//       accountId,
//       userId,
//       orderId: "",
//       paymentMethodId,
//     });

//     const respo = await receipt.save();

//     const statement = await Statement.find({ userId })
//       .sort({ date: -1 })
//       .limit(1);

//     //Getting current statement balance
//     const balance = statement[0]?.balance || 0;

//     const newStatement = Statement({
//       particulars: description,
//       quantity: 1,
//       userId,
//       reference,
//       price: amount,
//       date,
//       type: "credit",
//       credit: amount,
//       debit: 0,
//       balance: balance + parseFloat(amount),
//     });

//     await newStatement.save();

//     const user = await User.findById(userId);

//     const wallet = parseFloat(user.wallet);
//     const newWallet = balance + parseFloat(amount);
//     user.wallet = newWallet.toString();
//     await user.save();

//     res.status(201).json({ message: "Receipt created successfully" });
//   } catch (error) {
//     console.log(error);
//   }
// });

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
