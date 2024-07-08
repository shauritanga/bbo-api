const express = require("express");
const Report = require("../models/report.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const reports = await Report.find();
  if (reports) {
    res.status(200).json(reports);
  } else {
    res.status(404).json({ message: "No reports found" });
  }
});

// router.post("/", async (req, res) => {
//   const report = Report({
//     ...req.body,
//   });
//   const result = await report.save();
//   res.status(201).json(result);
// });

router.get("/:id", (req, res) => {
  res.send("reports");
});

router.put("/:id", (req, res) => {
  res.send("reports");
});

router.delete("/:id", (req, res) => {
  res.send("reports");
});

module.exports = router;
