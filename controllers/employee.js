const nodemailer = require("nodemailer");
const Employee = require("../models/employee.js");

let transporter = nodemailer.createTransport({
  host: "mail.alphafunds.co.tz",
  auth: {
    user: "admin@alphafunds.co.tz", // replace with your email
    pass: "vct6?99^i}^]", // replace with your password
  },
});
module.exports.addEmployee = async (req, res) => {
  const { email } = req.body;
  try {
    const employee = new Employee({ ...req.body });
    const employeeResults = await employee.save();

    const passwordResetLink = `https://admin.alphafunds.co.tz/reset-password?email=${email}`;

    const mailOptions = {
      from: '"Alpha Capital" admin@alphafunds.co.tz',
      to: email,
      subject: "Account Activation",
      text: `Click the following link to change your password: ${passwordResetLink}`,
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json(employeeResults);
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(500).json({ message: "User already exists" });
    }
    return res.status(500).json({ message: error.message });
  }
};
