const express = require("express");
const {
  createBrokerage,
  getAllBrokerage,
} = require("../controllers/brokerage.js");
const router = express.Router();

router.get("/", getAllBrokerage);
router.post("/", createBrokerage);

module.exports = router;
