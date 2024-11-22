const express = require("express");
const Order = require("../models/order.js");
const {
  getAllOrders,
  createOrder,
  adminDeleteOrder,
  adminUpdateOrder,
  getOrderById,
  getUnderProcessOrders,
} = require("../controllers/orderController.js");
const Customer = require("../models/customer.js");
const Security = require("../models/security.js");
const route = express.Router();

//ADMIN ROUTE
route.get("/all", getAllOrders);
route.get("/dealing", getUnderProcessOrders);
route.get("/:id", getOrderById);
route.post("/", createOrder);
route.patch("/:id", adminUpdateOrder);
route.delete("/admin/:id", adminDeleteOrder);

route.get("/", async (req, res) => {
  const orders = await Order.find({})
    .sort({ date: -1 })
    .populate("user")
    .populate("security");

  res.status(200).json(orders);
});

route.get("/all/:id", async (req, res) => {
  try {
    const orders = await Order.find({ client_id: req.params.id });

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
route.get("/buy/:id", async (req, res) => {
  try {
    const orders = await Order.find({
      client_id: req.params.id,
      type: "buy",
    });

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
    const orders = await Order.find({ client_id: req.params.id, type: "sell" });

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

route.get("/client/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const order = await Order.find({ client_id: req.params.id });

    res.send(order);
  } catch (error) {
    res.send(error);
  }
});

// route.post("/", async (req, res) => {
//   try {
//     const { type, customer, security, ...orderData } = req.body;
//     const isValidType = ["buy", "sell"].includes(type.toLowerCase());
//     if (!isValidType) {
//       return res.status(400).json({ message: "Invalid order type" });
//     }

//     if (type.toLowerCase() === "sell") {
//       const securityDoc = await Security.findById(security);
//       if (!securityDoc) {
//         return res.status(404).json({ message: "Security not found" });
//       }
//       const customerDoc = await Customer.findById(customer);
//       if (!customerDoc) {
//         return res.status(404).json({ message: "Customer not found" });
//       }
//       if (!customerDoc.shares.some((s) => s.toString() === security)) {
//         // Check if the customer owns the security
//         return res
//           .status(400)
//           .json({ message: `You don't have shares of ${securityDoc.name}` });
//       }
//     }
//     const order = await Order.create({
//       type,
//       customer,
//       security,
//       ...orderData,
//     });
//     res.status(201).json({ message: "Order created successfully", order });
//   } catch (error) {
//     console.log(error);
//   }

// try {
//   const orderType = req.body.type;
//   const order = Order({
//     ...req.body,
//   });
//   const savedOrder = await order.save();
//   if (orderType.toLowerCase() === "buy") {
//     const customer = await Customer.findOne({ _id: req.body.customer });
//     customer.shares.push(savedOrder._id);
//     await customer.save();
//   }
//   res.status(200).json({ message: "Data saved successfully" });
// } catch (error) {
//   res.status(500).json({ message: error.message });
// }
// });
// route.post("/sell", async (req, res) => {
//   // try {
//   //   const orderType = req.body.type;
//   //   const order = Order({
//   //     ...req.body,
//   //   });
//   //   const savedOrder = await order.save();
//   //   if (orderType.toLowerCase() === "buy") {
//   //     const customer = await Customer.findOne({ _id: req.body.customer });
//   //     customer.shares.push(savedOrder._id);
//   //     await customer.save();
//   //   }
//   //   res.status(200).json({ message: "Data saved successfully" });
//   // } catch (error) {
//   //   res.status(500).json({ message: error.message });
//   // }
// });

route.patch("/:id", async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id });
  console.log(customer);
  //updating logic here

  res.send({ message: "Data saved successfully" });
});

module.exports = route;
