const express = require("express");
const { createVAT, getVAT, getVATMonthly } = require("../controllers/vat.js");
const router = express.Router();

router.get("/", getVAT);
router.get("/montly", getVATMonthly);
router.post("/", createVAT);

module.exports = router;
