const express = require("express");
const {
  createExecution,
  getAllExecutions,
  getExecution,
} = require("../controllers/execution.js");
const router = express.Router();

router.get("/", getAllExecutions);
router.get("/:id", getExecution);
router.post("/", createExecution);

module.exports = router;
