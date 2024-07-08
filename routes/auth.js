const express = require("express");
const Employee = require("../models/employee.js");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customer.js");
const Otp = require("../models/otp.js");
const router = express.Router();

const generateActivationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const activationTokens = {};

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "curtisisaac36@gmail.com", // replace with your email
    pass: "mpee ioxs pbyv juss", // replace with your password
  },
});

router.post("/signup/clients", async (req, res) => {
  const { email, password } = req.body;
  const token = generateActivationToken();

  activationTokens[email] = token;

  const activationLink = `https://client.alphafunds.co.tz/activate?email=${encodeURIComponent(
    email
  )}&token=${token}`;

  const mailOptions = {
    from: "curtisisaac36@gmail.com",
    to: email,
    subject: "Account Activation",
    text: `Click the following link to activate your account: ${activationLink}`,
  };
  try {
    // Send email with PDF attachment
    let info = await transporter.sendMail(mailOptions);
    if (!info) {
      throw new Error("Failed to send email");
    }
    const customer = Customer({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      dob: req.body.dob,
      idType: req.body.identity,
      idNumber: req.body.identity_no,
    });
    const result = await customer.save();
    console.log(result);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
});

router.post("/login/clients", async (req, res) => {
  const { email } = req.body;

  try {
    const client = await Customer.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Username not found" });
    }
    const token = jwt.sign({ clientId: client._id }, "ilovecode");

    res.json({
      message: "Login successful",
      token,
      user: client,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error", ok: false });
  }
});

router.post("/login/employees", async (req, res) => {
  const { username, password } = req.body;
  console.log({ username, password });

  try {
    const employee = await Employee.findOne(
      { email: username },
      { _id: 0, __v: 0 }
    ).populate("role");

    if (!employee) {
      return res.status(404).json({ message: "Username not found" });
    }

    if (!employee.comparePassword(password)) {
      return res.status(400).json({ message: "Wrong password" });
    }
    // Token Generation (for authentication in future requests)
    const token = jwt.sign({ employeeId: employee._id }, "ilovecode");

    res.json({
      message: "Login successful",
      token,
      user: employee,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/activate", async (req, res) => {
  //getting email and token from the link
  const { email, token } = req.query;
  //checking if email and token are present
  if (email && token) {
    //checking if token is valid
    //updating user table to make verified true
    const customer = await Customer.findOneAndUpdate(
      { email },
      { verified: true }
    );
    if (!customer) {
      return res.status(404).json({ message: "User not found" });
    }
    //checking if token is valid
    // if (activationTokens[email] !== token) {
    //   return res.status(400).json({ message: "Invalid token"});
    // }
    //sending response
    res.status(200).json({ message: "Account activated successfully" });

    console.log("email and token are present");
  } else {
    res.status(400).send("Invalid request");
  }
});

router.post("/otp", async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  // otps[email] = otp;

  const mailOptions = {
    from: "curtisisaac36@gmail.com",
    to: email,
    subject: "One-Time Password (OTP)",
    text: `Your One-Time Password (OTP) is: ${otp}`,
  };

  const info = await transporter.sendMail(mailOptions);
  if (!info) {
    return res
      .status(500)
      .send("Failed to send OTP email. Please try again later.");
  }
  await Otp.create({ email, otp });
  res.send("OTP email sent successfully!");
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await Otp.findOne({ email, otp });
  if (!user) {
    return res.status(400).send("Invalid OTP");
  }
  //await Otp.deleteOne({ email, otp });
  res.send(user);
});

router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });
  const user = await Employee.findOne({ email });
  if (!user) {
    return res.status(404).send("User not found");
  }
  user.password = password;
  await user.save();
  res.send("Password reset successfully");
});

module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, "ilovecode", (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.userId = user._id;
    next();
  });
};

module.exports = router;
