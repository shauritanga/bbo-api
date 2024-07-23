const express = require("express");
const { createProfile, getAllProfiles } = require("../controllers/profile");

const router = express.Router();

router.post("/", createProfile);
router.get("/", getAllProfiles);

module.exports = router;
