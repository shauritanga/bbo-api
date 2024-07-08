const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: {
    type: String,
  },
  number: {
    type: String,
  },
  price: {
    type: Number,
  },
});

const Security = mongoose.model("Security", schema);
module.exports = Security;
