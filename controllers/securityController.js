const Security = require("../models/security");
const { body, validationResult } = require("express-validator");

const validationRules = [
  body("name").isString().trim().notEmpty().withMessage("Name is required"),
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

const createSecurity = async (req, res) => {
  const errors = validationResult(req);
  try {
    const security = Security({
      ...req.body,
    });
    const saveResult = await security.save();
    res.send(saveResult);
  } catch (error) {}
};
const editSecurity = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.id;

  const { name, price } = req.body;

  try {
    const security = await Security.findOne({ _id: id });
    if (!security) {
      return res
        .status(404)
        .json({ message: "No such security in our records" });
    }
    security.name = name;
    security.price = price;
    await security.save();
    res.status(200).json({ message: "Security was successful updated" });
  } catch (error) {}
};
const deleteSecurity = async (req, res) => {
  const id = req.params.id;
  try {
    await Security.findOneAndDelete({ _id: id });
    res.json(200).json({ message: "Security was successful updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSecurity, editSecurity, deleteSecurity };
