const express = require("express");
const { createFidelity } = require("../controllers/fidelity.js");
const router = express.Router();

router.get("/");
router.post("/", createFidelity);

module.exports = router;
