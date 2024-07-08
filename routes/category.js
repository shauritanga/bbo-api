const express = require("express");
const Category = require("../models/category.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await Category.find().populate("manager");
  if (!categories) {
    return res.status(404).json({ message: "No categories found" });
  }
  console.log({ categories });
  res.status(200).json(categories);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.json(category);
});
router.post("/", async (req, res) => {
  const category = await Category.create(req.body);
  res.json(category);
});

router.put("/", async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.body.id, req.body);
  res.json(category);
});

router.patch("/", async (req, res) => {
  await Category.findByIdAndUpdate(req.body.id, req.body);
  res.json(category);
});

router.delete("/", async (req, res) => {
  await Category.findByIdAndDelete(req.body.id);
});

module.exports = router;
