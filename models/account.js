const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
  name: { type: String },
  nature: { type: String },
  code: { type: String },
  account_number: { type: String },
  description: { type: String },
  increase: { type: String },
  decrease: { type: String },
  deleted_at: { type: String },
  business_id: { type: String },
  branch_id: { type: String },
  class_id: { type: String },
});

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
