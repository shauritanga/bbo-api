const express = require("express");
const Order = require("../models/order.js");
const { getAllOrders } = require("../controllers/order.js");
const route = express.Router();

//ADMIN ROUTE
route.get("/all", getAllOrders);

route.get("/", async (req, res) => {
  const orders = await Order.find({}, { password: 0 })
    .populate("customer")
    .populate("security");
  res.status(200).json(orders);
});

route.get("/all/:id", async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.id })
      .populate("security")
      .populate("customer");
    if (!orders) {
      res.status(404).json({ message: "No orders found" });
    } else {
      res.status(200).json(orders);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
route.get("/buy/:id", async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.id, type: "buy" })
      .populate("security")
      .populate("customer");
    if (!orders) {
      res.status(404).json({ message: "No orders found" });
    } else {
      res.status(200).json(orders);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
route.get("/sell/:id", async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.id, type: "sell" })
      .populate("security")
      .populate("customer");
    if (!orders) {
      res.status(404).json({ message: "No orders found" });
    } else {
      res.status(200).json(orders);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

route.get("/dealing", async (req, res) => {
  try {
    const orders = await Order.find({ balance: { $ne: 0 } })
      .populate("customer")
      .populate("security");

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

route.get("/:id", async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    res.send(order);
  } catch (error) {
    res.send(error);
  }
});

route.post("/", async (req, res) => {
  const order = Order({
    ...req.body,
  });

  await order.save();

  res.send({ message: "Data saved successfully" });
});

route.patch("/:id", async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id });
  console.log(customer);
  //updating logic here

  res.send({ message: "Data saved successfully" });
});

module.exports = route;
