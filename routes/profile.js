const express = require("express");
const {
  createProfile,
  getAllProfiles,
  getProfileByCustomerId,
} = require("../controllers/profile");

const router = express.Router();

router.post("/", createProfile);
router.get("/", getAllProfiles);
router.get("/:id", getProfileByCustomerId);

module.exports = router;
