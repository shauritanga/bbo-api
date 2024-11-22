const express = require("express");
const Employee = require("../models/employee.js");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customer.js");
const User = require("../models/user.js");
const Otp = require("../models/otp.js");
const { login, verifyOTP } = require("../controllers/authController.js");
const router = express.Router();

const generateActivationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const activationTokens = {};

let transporter = nodemailer.createTransport({
  host: "mail.alphafunds.co.tz",
  // port: 587,
  auth: {
    user: "admin@alphafunds.co.tz", // replace with your email
    pass: "vct6?99^i}^]", // replace with your password
  },
});

router.post("/signup/clients", async (req, res) => {
  const { email, password } = req.body;
  const token = generateActivationToken();

  activationTokens[email] = token;

  const activationLink = `${
    process.env.CLIENT_URL
  }/activate?email=${encodeURIComponent(email)}&token=${token}`;

  const mailOptions = {
    from: '"Alpha Capital" admin@alphafunds.co.tz',
    to: email,
    subject: "Account Activation",
    text: `Click the following link to activate your account: ${activationLink}`,
  };
  try {
    const customer = User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      dob: req.body.dob,
      idType: req.body.identity,
      idNumber: req.body.identity_no,
    });

    const result = await customer.save();
    const info = await transporter.sendMail(mailOptions);
    if (!info) {
      throw new Error("Failed to send email");
    }
    res.status(200).json({
      message:
        "We appreciate your registration! Kindly check your email to complete the activation process",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(500)
        .json({ message: `${req.body.email} is already registered` });
    }
    res.status(500).json({ message: `${error}` });
  }
});

router.post("/login/clients", async (req, res) => {
  const { email } = req.body;

  try {
    const client = await User.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Username not found" });
    }
    const token = jwt.sign({ clientId: client.id }, "ilovecode");

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

// router.post("/login/employees", async (req, res) => {
//   const { username } = req.body;

//   try {
//     const employee = await Employee.findOne(
//       { email: username },
//       { _id: 0, __v: 0 }
//     ).populate("role");

//     if (!employee) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     // Token Generation (for authentication in future requests)
//     const token = jwt.sign({ employeeId: employee._id }, "ilovecode");

//     res.json({
//       message: "Login successful",
//       token,
//       user: employee,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
router.post("/login/employees", login);

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
  } else {
    res.status(400).send("Invalid request");
  }
});

router.post("/clients/otp", async (req, res) => {
  const { email, password } = req.body;
  const otp = generateOTP();

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!user.verified) {
    return res
      .status(403)
      .json({ message: "Please activate your account to continue" });
  }

  const mailOptions = {
    from: '"Alpha Capital" admin@alphacapital.co.tz',
    to: email,
    subject: "One-Time Password (OTP)",
    text: `Your One-Time Password (OTP) is: ${otp}`,
  };

  const info = await transporter.sendMail(mailOptions);
  if (!info) {
    return res
      .status(500)
      .json({ message: "Failed to send OTP email. Please try again later." });
  }
  await Otp.create({ email, otp });
  res.status(200).json({ message: "Please check your email for the OTP" });
});

router.post("/otp", async (req, res) => {
  const { email, password } = req.body;
  const otp = generateOTP();

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("=================1=====================");

    const mailOptions = {
      from: '"Alpha Capital" admin@alphafunds.co.tz',
      to: email,
      subject: "One-Time Password (OTP)",
      text: `Your One-Time Password (OTP) is: ${otp}`,
    };

    console.log("=================2=====================");

    const info = await transporter.sendMail(mailOptions);

    console.log("=================3=====================");
    if (!info) {
      throw new Error("Fail to send resent passwordd email");
    }
    await Otp.create({ email, otp });
    res.status(200).json({ message: "OTP email sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/verify-otp", verifyOTP);

// router.post("/verify-otp", async (req, res) => {
//   const { email, otp } = req.body;
//   const user = await Otp.findOne({ email, otp });
//   if (!user) {
//     return res.status(400).json({ message: "Invalid OTP" });
//   }
//   await Otp.deleteOne({ email, otp });
//   res.send(user);
// });

router.post("/clients/request-reset-password", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  const client = await User.findOne({ email });
  if (!client) {
    return res.status(400).json({
      message:
        "You need to register with us before you proceed! Please register",
    });
  }

  const token = generateActivationToken();
  const resetPasswordLink = `${
    process.env.CLIENT_URL
  }/reset-password?email=${encodeURIComponent(email)}&token=${token}`;

  const mailOptions = {
    from: '"Alpha Capital" admin@alphafunds.co.tz',
    to: email,
    subject: "Reset Password",
    text: `Visit the link given to reset password: ${resetPasswordLink}`,
  };
  const info = await transporter.sendMail(mailOptions);

  if (!info) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  res.status(200).json({
    message: `Please ckeck your email for a password reset link sent to ${email}`,
  });
});

router.post("/clients/reset-password", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ message: `${email} is not a registered user` });
  }
  user.password = password;
  const updatedUser = await user.save();
  if (!updatedUser) {
    return res
      .status(400)
      .json({ message: `$Password update failed, try again` });
  }

  res
    .status(200)
    .json({ message: "You have successfully updated your password" });
});

/*====================== ADMIN ==================================*/
router.post("/employees/request-reset-password", async (req, res) => {
  const { email } = req.body;

  const user = await Employee.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message:
        "You need to register with us before you proceed! Please register",
    });
  }

  const token = generateActivationToken();
  const resetPasswordLink = `${
    process.env.ADMIN_URL
  }/reset-password?email=${encodeURIComponent(email)}&token=${token}`;

  const mailOptions = {
    from: '"Alpha Capital" admin@alphafunds.co.tz',
    to: email,
    subject: "Reset Password",
    text: `Visit the link given to reset password: ${resetPasswordLink}`,
  };
  const info = await transporter.sendMail(mailOptions);

  if (!info) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  res.status(200).json({
    message: `Please ckeck your email for a password reset link sent to ${email}`,
  });
});

router.post("/employees/reset-password", async (req, res) => {
  const { email, password } = req.body;
  const user = await Employee.findOne({ email });
  if (user === null) {
    return res.status(400).json({ message: "User not found" });
  }
  user.password = password;
  user.status = "active";
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
