const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const CustomerCounter = require("./counter/customerCounter.js");

const customerSchema = mongoose.Schema(
  {
    customerId: { type: String, unique: true },
    account: {
      type: String,
    },
    name: {
      type: String,
    },
    bankName: {
      type: String,
    },
    category: {
      type: String,
    },
    country: {
      type: String,
    },
    phone: {
      type: String,
    },
    idType: {
      type: String,
    },
    idNumber: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    dob: {
      type: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending",
    },
    wallet: {
      type: Number,
      default: 0,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

customerSchema.pre("save", async function (next) {
  const doc = this;
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);

  //custom id
  if (doc.isNew) {
    const customerCounter = await CustomerCounter.findByIdAndUpdate(
      { _id: "customerId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seq = String(customerCounter.seq).padStart(5, "0");
    doc.customerId = `ACL${seq}`;
  }
  next();
});

customerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
