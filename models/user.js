const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
});

userSchema.pre("save", async (next) => {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.getSignedJwtToken = () => {};

module.exports = mongoose.model("User", userSchema);
