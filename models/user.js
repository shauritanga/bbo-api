const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    status: { type: String, default: "pending" },
    type: { type: String },
    email: { type: String, unique: true },
    phone: { type: String },
    dseAccount: { type: String },
    botAccount: { type: String },
    bankAccountName: { type: String },
    bankAccountNumber: { type: String },
    bankName: { type: String },
    manager_id: { type: String },
    password: { type: String },
    approvedBy: { type: String },
    wallet: { type: Number, default: 0.0 },
    gender: { type: String },
    dob: { type: Date },
    placeOfBirth: { type: String },
    idType: { type: String },
    idNumber: { type: String },
    address: { type: String },
    nationality: { type: String },
    tin: { type: String },
    isEmployed: { type: Boolean, default: false },
    employerName: { type: String },
    region: { type: String },
    district: { type: String },
    ward: { type: String },
    street: { type: String },
    dseAccount: { type: String },
    botAccount: { type: String },
    bankAccountName: { type: String },
    bankAccountNumber: { type: String },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    verified: { type: Boolean, default: false },
    processed: { type: Boolean, default: false },
    nextOfKinName: { type: String },
    nextOfKinRelationship: { type: String },
    nextOfKinResidence: { type: String },
    nextOfKinRegion: { type: String },
    nextOfKinPhone: { type: String },
    nextOfKinEmail: { type: String },
    otp: { type: Number },
    otpExpiry: { type: Number },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedJwtToken = () => {};

module.exports = mongoose.model("User", userSchema);
