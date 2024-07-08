const express = require("express");
const PaymentMethod = require("../models/payment-method.js");

const router = express.Router();
router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const paymentMethods = await PaymentMethod.find({});
      res.status(200).json(paymentMethods);
    } catch (error) {
      res.status(404).json(error);
    }
  })
  .post(async (req, res, next) => {
    const payMethod = PaymentMethod({
      ...req.body,
    });
    try {
      await payMethod.save();
      res.status(201).json({ message: "Success" });
    } catch (error) {
      res.status(404).json({ message: error });
    }
  });

module.exports = router;
