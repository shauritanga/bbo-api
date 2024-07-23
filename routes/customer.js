const express = require("express");
const User = require("../models/user.js");
const route = express.Router();

route.get("/", async (req, res) => {
  const customers = await User.find({}, { password: 0 }).sort({ name: 1 });
  res.send(customers);
});

route.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });
    console.log({ customer });
    res.send(customer);
  } catch (error) {
    res.send(error);
  }
});
route.get("/clients/:token", async (req, res) => {
  console.log(token);
  try {
    const customer = await Customer.findOne({ _id: req.params.id });
    res.send(customer);
  } catch (error) {
    res.send(error);
  }
});

route.post("/", async (req, res) => {
  const customer = Customer({
    ...req.body,
  });

  await customer.save();

  res.send({ message: "Data saved successfully" });
});

route.patch("/:id", async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body, status: "active" } },

      { new: true }
    );

    res.status(200).json({ message: "Customer data updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

route.delete("/:id", async (req, res) => {
  const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
  res.send({ message: "Item deleted successfully" });
});

const customerRoute = route;
module.exports = customerRoute;
