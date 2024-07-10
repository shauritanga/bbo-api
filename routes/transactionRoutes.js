// transactionRoutes.js
const express = require("express");
const {
  createTransaction,
  getAllTransactions,
  getTransactionByCustomerId,
  updateTransaction,
} = require("../controllers/transactionController.js");
// Import other controllers

const router = express.Router();
//router.use(passport.authenticate("local", { session: false }));
router.get("/customer/:id", getTransactionByCustomerId);
router.post("/", createTransaction);
router.get("/", getAllTransactions);
router.patch("/:id", updateTransaction);
// Add routes for other actions (GET, PATCH, DELETE)

module.exports = router;