// authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Employee = require("../models/employee");
const { initiateOTPProcess } = require("../services/otpServices");

// Login Route
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await Employee.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email" });

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid email or password" });

    // Initiate OTP Process (generate and send OTP to user)
    await initiateOTPProcess(user);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Register user
const register = async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    id: Date.now(),
    username,
    password: hashedPassword,
    role: "user",
  });
  res.json({ message: "User registered successfully" });
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  // Find user by email
  const user = await Employee.findOne({ email });
  //if (!user) return res.status(401).json({ message: "Invalid email" });

  // Check if OTP matches and is not expired
  //const isOTPValid = user.otp === parseInt(otp) && Date.now() < user.otpExpiry;
  // if (!isOTPValid)
  // return res.status(401).json({ message: "Invalid or expired OTP" });

  // Clear OTP and expiry after successful verification
  // user.otp = null;
  // user.otpExpiry = null;
  //await user.save();

  // Create a JWT token (or a session)
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  return res.status(200).json({ message: "Login successful", token });
};

module.exports = { register, login, verifyOTP };
