const mongoose = require("mongoose");
const financialSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  status: String,
});
const Financial = mongoose.model("Financial", financialSchema);
module.exports = Financial;
