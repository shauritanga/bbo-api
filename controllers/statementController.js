const Statement = require("../models/statement.js");

// Function to get all statements by user ID
const getAllStatementsByUserId = async (req, res) => {
  try {
    const id = req.params.id;
    const statements = await Statement.find({ userId: id });

    res.send(statements);
  } catch (error) {
    console.error("Error fetching statements:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching statements." });
  }
};

const getStatementsToPrint = async (req, res) => {
  const customerId = req.params.id;
  const { from, to } = req.query;

  console.log(from);

  const startDate = new Date(from);
  const endDate = new Date(to);
  console.log(startDate);

  const statements = await Statement.find({
    userId: customerId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  console.log(statements);
};

// Export the function
module.exports = { getAllStatementsByUserId, getStatementsToPrint };
