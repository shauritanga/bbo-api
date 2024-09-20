const express = require("express");
const User = require("../models/user.js");
const {
  adminCreateCustomer,
  adminUpdateCustomer,
} = require("../controllers/customerController.js");
const route = express.Router();

route.get("/", async (req, res) => {
  const customers = await User.find({}, { password: 0 }).sort({ name: 1 });
  res.send(customers);
});

route.get("/:id", async (req, res) => {
  try {
    const customer = await User.findOne({ id: req.params.id });

    res.send(customer);
  } catch (error) {
    res.send(error);
  }
});
route.get("/clients/:token", async (req, res) => {
  try {
    const customer = await User.findOne({ _id: req.params.id });
    res.send(customer);
  } catch (error) {
    res.send(error);
  }
});

route.post("/admin", adminCreateCustomer);

// route.patch("/:id", adminUpdateCustomer);

// route.patch("/:id", async (req, res) => {
//   try {
//     const updatedCustomer = await User.findByIdAndUpdate(
//       req.params.id,
//       { $set: { ...req.body, status: "active" } },

//       { new: true }
//     );

//     res.status(200).json({ message: "Customer data updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

route.delete("/:id", async (req, res) => {
  const deletedCustomer = await User.findByIdAndDelete(req.params.id);
  res.send({ message: "Item deleted successfully" });
});

const customerRoute = route;
module.exports = customerRoute;
