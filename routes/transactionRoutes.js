// transactionRoutes.js
const express = require("express");
const {
  createTransaction,
  getAllTransactions,
  getTransactionByCustomerId,
  approveTransaction,
  getPaymentTransactions,
  getExpenseTransactions,
  getReceiptTransactions,
  getTransactionAsStatementsByCustomerId,
} = require("../controllers/transactionController.js");
// Import other controllers

const router = express.Router();
//router.use(passport.authenticate("local", { session: false }));

router.get("/payments", getPaymentTransactions);
router.get("/expenses", getExpenseTransactions);
router.get("/receipts", getReceiptTransactions);
router.get("/admin/:id", getTransactionAsStatementsByCustomerId);
router.get("/:id", getTransactionByCustomerId);
router.post("/", createTransaction);
router.get("/", getAllTransactions);
router.patch("/:id", approveTransaction);
// Add routes for other actions (GET, PATCH, DELETE)

module.exports = router;
