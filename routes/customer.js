const express = require("express");
const Customer = require("../models/customer.js");
const route = express.Router();

route.get("/", async (req, res) => {
  const customers = await Customer.find({}, { password: 0 });
  res.send(customers);
});

route.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });
    res.send(customer);
  } catch (error) {
    res.send(error);
  }
});
route.get("/clients/:token", async (req, res) => {
  console.log(token);
  // try {
  //   const customer = await Customer.findOne({ _id: req.params.id });
  //   res.send(customer);
  // } catch (error) {
  //   res.send(error);
  // }
});

route.post("/", async (req, res) => {
  const customer = Customer({
    ...req.body,
  });

  await customer.save();

  res.send({ message: "Data saved successfully" });
});

route.patch("/:id", async (req, res) => {
  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.send(updatedCustomer);
});

route.delete("/:id", async (req, res) => {
  const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
  res.send({ message: "Item deleted successfully" });
});

const customerRoute = route;
module.exports = customerRoute;
