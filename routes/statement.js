const express = require("express");
const Statement = require("../models/statement.js");
const route = express.Router();

route.get("/", async (req, res) => {
  if (req.query) {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    console.log({ startDate, endDate });
    Statement.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .then((documents) => {
        // Process the retrieved documents
        console.log(documents);
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });
  }
  const statements = await Statement.find({});
  res.send(statements);
});

route.post("/", async (req, res) => {
  const statement = Statement({
    ...req.body,
  });
  await statement.save();
  res.send({ message: "Success" });
});

route.get("/:id", async (req, res) => {
  const statement = await Statement.find({ _id: req.params.id });
  res.send(statement);
});

route.post("/:id", async (req, res) => {
  const response = await Statement.updateOne(
    { _id: req.params.id },
    { ...req.body }
  );
  res.send(response.acknowledged);
});

route.delete("/:id", async (req, res) => {
  const statement = await Statement.findByIdAndDelete(req.params.id);
  res.send(statement);
});

module.exports = route;
