const express = require("express");
const Financial = require("../models/financialYear.js");
const router = express.Router();

router.get("/", async (req, res) => {
  const financial = await Financial.find();
  if (!financial) {
    return res.status(404).send("financial not found");
  }
  res.status(200).json(financial);
});
router.post("/", async (req, res) => {
  const financial = Financial({
    ...req.body,
  });
  const result = await financial.save();
  res.send(result);
});

router.put("/", (req, res) => {
  res.send("financial");
});
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Financial.findByIdAndDelete(id);
  if (!result) {
    return res.status(404).send("financial not found");
  }
  console.log(result);
  res.send(result);
});

module.exports = router;
