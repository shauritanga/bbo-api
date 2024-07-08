const express = require("express");
const Role = require("../models/role.js");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const roles = await Role.find({});
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const role = await Role.findOne({ _id: id });
    res.status(200).json(role);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const role = Role({
      ...req.body,
    });
    const res = await role.save();
    res.status(201).json(res);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const role = await Role.updateOne({ _id: id }, { ...req.body });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/id", async (req, res) => {
  const id = req.params.id;
  try {
    await Role.findByIdAndDelete(id);
  } catch (error) {}
});

module.exports = router;
