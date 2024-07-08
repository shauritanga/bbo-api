const express = require("express");
const Employee = require("../models/employee.js");
const { addEmployee } = require("../controllers/employee.js");
const router = express.Router();

router.post("/", addEmployee);

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find({}).populate("role");

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const employee = await Employee.findOne({ _id: id });
    res.status(200).json(employee);
  } catch (error) {
    res.status(404).json(error);
  }
});

// router.post("/", async (req, res) => {
//   try {
//     const employee = new Employee({
//       ...req.body,
//     });
//     await employee.save();
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       // Handle validation errors
//       console.error(error.message);
//       return res.status(400).json({ message: error.message });
//     } else {
//       // Handle other errors (e.g., database connection errors)
//     }
//   }
// });

router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const employee = await Employee.updateOne({ _id: id }, { ...req.body });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/id", async (req, res) => {
  const id = req.params.id;
  try {
    await Employee.findByIdAndDelete(id);
  } catch (error) {}
});

module.exports = router;
