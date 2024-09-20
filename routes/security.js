const express = require("express");
const Security = require("../models/security.js");

const { body, validationResult } = require("express-validator");

const validationRules = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => {
      if (value < 0) {
        throw new Error("Price must be greater than zero");
      }
      return true;
    }),
];

const {
  editSecurity,
  deleteSecurity,
} = require("../controllers/securityController.js");
const route = express.Router();

route.get("/", async (req, res) => {
  const securities = await Security.find({});
  res.send(securities);
});

route.get("/:id", async (req, res) => {
  try {
    const security = await Security.findOne({ _id: req.params.id });
    res.send(security);
  } catch (error) {
    res.send(error);
  }
});

route.post("/", validationRules);

route.patch("/:id", validationRules, editSecurity);
route.delete("/:id", deleteSecurity);
module.exports = route;
