const express = require("express");
const { createCDS } = require("../controllers/cds.js");
const router = express.Router();

router.get("/");
router.post("/", createCDS);

module.exports = router;
