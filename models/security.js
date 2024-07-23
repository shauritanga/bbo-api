const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    id: { type: String },
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    price: {
      type: Number,
    },
    number: { type: Number },
  },
  { timestamps: true }
);

const Security = mongoose.model("Security", schema);
module.exports = Security;
