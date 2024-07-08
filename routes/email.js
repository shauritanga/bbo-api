const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const crypto = require("crypto");
const Customer = require("../models/customer.js");
const Report = require("../models/report.js");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create Nodemailer transporter
let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "curtisisaac36@gmail.com", // replace with your email
    pass: "mpee ioxs pbyv juss", // replace with your password
  },
});

// Generate a random activation token
const generateActivationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTPs in memory or a database
const otps = {};

// Store activation tokens in memory or a database
const activationTokens = {};

router.post("/send-email-with-pdf", upload.single("pdf"), async (req, res) => {
  const { email, subject } = req.body;
  const pdf = req.file?.buffer;

  if (!email || !subject || !pdf) {
    return res.status(400).send("Please provide all required fields.");
  }

  try {
    // Send email with PDF attachment
    let info = await transporter.sendMail({
      from: "curtisisaac36@gmail.com", // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: "Please find the attached PDF", // plain text body
      attachments: [
        {
          filename: "document.pdf",
          content: pdf,
        },
      ],
    });

    console.log("Email sent: ", info.messageId);
    res.send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email. Please try again later.");
  }
});

router.post("/send-activation-email", (req, res) => {
  const { email } = req.body;
  const token = generateActivationToken();

  activationTokens[email] = token;

  const activationLink = `https://api.alphafunds.co.tz/api/v1/activate?email=${encodeURIComponent(
    email
  )}&token=${token}`;

  const mailOptions = {
    from: "curtisisaac36@gmail.com",
    to: email,
    subject: "Account Activation",
    text: `Click the following link to activate your account: ${activationLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending activation email:", error);
      res
        .status(500)
        .send("Failed to send activation email. Please try again later.");
    } else {
      console.log("Activation email sent:", info.response);
      res.send("Activation email sent successfully!");
    }
  });
});

router.post("/send-otp-email", (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  otps[email] = otp;

  const mailOptions = {
    from: "curtisisaac36@gmail.com",
    to: email,
    subject: "One-Time Password (OTP)",
    text: `Your One-Time Password (OTP) is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending OTP email:", error);
      res.status(500).send("Failed to send OTP email. Please try again later.");
    } else {
      console.log("OTP email sent:", info.response);
      res.send("OTP email sent successfully!");
    }
  });
});

router.post("/send-report-email", async (req, res) => {
  const { title, editorHtml } = req.body;
  const customerEmails = await Customer.find({}, { email: 1, _id: 0 });
  const savedReport = await Report.create({
    title,
  });
  customerEmails.forEach((customer) => {
    const mailOptions = {
      from: "curtisisaac36@gmail.com",
      to: customer.email,
      subject: title,
      html: editorHtml,
    };
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error("Error sending report email:", error);
        res
          .status(500)
          .send("Failed to send report email. Please try again later.");
      } else {
        //save data to report database
        await Report.findByIdAndUpdate(
          savedReport._id,
          {
            $set: { status: "sent" },
            $inc: { recipients: 1 },
          },
          { new: false }
        );
        console.log("Report email sent:", info.response);
      }
    });
  });
  const returnedReport = await Report.findById(savedReport._id);
  res.status(200).send(returnedReport);
});

module.exports = router;
