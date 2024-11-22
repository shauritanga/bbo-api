// otpService.js
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const User = require("../models/user"); // User model

// Generate OTP
const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
    lowerCaseAlphabets: false,
  });
};

// Send OTP via email
const sendOTP = async (userEmail, otp) => {
  let transporter = nodemailer.createTransport({
    // host: "secure345.servconfig.com",
    host: "mail.alphafunds.co.tz",
    // port: 587,
    auth: {
      user: "admin@alphafunds.co.tz", // replace with your email
      pass: "vct6?99^i}^]", // replace with your password
    },
  });

  let mailOptions = {
    from: '"Alpha Capital" admin@alphafunds.co.tz',
    to: userEmail,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

// Function to initiate OTP process after successful password check
const initiateOTPProcess = async (user) => {
  const otp = generateOTP();

  // Save OTP and its expiry time to the user document
  try {
    user.otp = otp;
    user.otpExpiry = Date.now() + 20 * 60 * 1000; // OTP valid for 20 minutes
    await user.save();
    await sendOTP(user.email, otp);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  generateOTP,
  sendOTP,
  initiateOTPProcess,
};
