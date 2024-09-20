const express = require("express");
const {
  createExecution,
  getAllExecutions,
  getExecution,
  getOrderExecutions,
  getExecutionByClientId,
  processExecutionCreation,
} = require("../controllers/executionController.js");
const router = express.Router();

router.get("/", getAllExecutions);
router.get("/clients/:id", getOrderExecutions);
router.get("/statement/:id", getExecutionByClientId);
router.get("/:id", getExecution);
router.post("/", processExecutionCreation);

module.exports = router;
