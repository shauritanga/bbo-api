const express = require("express");
const { createDSE } = require("../controllers/dse.js");
const router = express.Router();

router.get("/");
router.post("/", createDSE);

module.exports = router;
