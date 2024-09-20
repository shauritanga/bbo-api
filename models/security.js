const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Security = mongoose.model("Security", schema);
module.exports = Security;
