const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  name: { type: String },
  status: { type: String },
  type: { type: String },
  email: { type: String },
  mobile: { type: String },
  is_admin: { type: String },
  dse_account: { type: String },
  bot_account: { type: String },
  bank_account_name: { type: String },
  bank_account_number: { type: String },
  manager_id: { type: String },
  email_verified_at: { type: String },
  password: { type: String },
  category_id: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
  deleted_at: { type: String },
  updated_by: { type: String },
  approved_by: { type: String },
  created_by: { type: String },
  wallet: { type: String },
  values: { type: {} },
  onboard_status: { type: String },
});

userSchema.pre("save", async (next) => {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedJwtToken = () => {};

module.exports = mongoose.model("User", userSchema);
