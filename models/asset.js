const mongoose = require("mongoose");
const schema = mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  price: {
    type: String,
  },
  purchase_date: {
    type: String,
  },
  status: {
    type: Number,
  },
  action: {
    type: Number,
  },
});

const Asset = mongoose.model("Asset", schema);
module.exports = Asset;
