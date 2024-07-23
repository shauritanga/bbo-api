const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const CustomerCounter = require("./counter/customerCounter.js");

const customerSchema = mongoose.Schema(
  {
    attnded: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    customerId: { type: String, unique: true },
    bankAccount: {
      type: String,
      default: null,
    },
    botAccount: { type: String, default: null },
    cdsAccount: {
      type: String,
      default: null,
    },
    name: {
      type: String,
    },
    bankName: {
      type: String,
      default: null,
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
      default: "new",
    },
    wallet: {
      type: Number,
      default: 0,
    },
    address: { type: String },
    occupation: { type: String },
    box: { type: String },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    files: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
      default: [],
    },
    nextOfKinName: { type: String },
    nextOfKinRelation: { type: String },
    nextOfKinResident: { type: String },
    nextOfKinRegion: { type: String },
    nextOfKinEmail: { type: String },
    nextOfKinMobile: { type: String },
    nameOfEmployer: { type: String },
    nameOfEmployer: { type: String },
    employerAddress: { type: String },
    isEmployed: { type: Boolean, default: false },
    shares: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },

  { timestamps: true }
);

customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);

  //custom id
  if (this.isNew) {
    const customerCounter = await CustomerCounter.findByIdAndUpdate(
      { _id: "customerId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seq = String(customerCounter.seq).padStart(5, "0");
    this.customerId = `ACL${seq}`;
  }
  next();
});

customerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
