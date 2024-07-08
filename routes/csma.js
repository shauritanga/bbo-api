const express = require("express");
const { createCSMA } = require("../controllers/csma.js");
const router = express.Router();

router.get("/");
router.post("/", createCSMA);

module.exports = router;
