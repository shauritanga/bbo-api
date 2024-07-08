const nodemailer = require("nodemailer");
const Employee = require("../models/employee.js");

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "curtisisaac36@gmail.com", // replace with your email
    pass: "mpee ioxs pbyv juss", // replace with your password
  },
});
module.exports.addEmployee = async (req, res) => {
  const { email } = req.body;
  const employee = new Employee({ ...req.body });
  const employeeResults = await employee.save();
  if (!employeeResults) {
    return res.status(400).json({ message: "Failed to add employee" });
  }

  const passwordResetLink = `https://admin.alphafunds.co.tz/reset-password?email=${email}`;

  const mailOptions = {
    from: "curtisisaac36@gmail.com",
    to: email,
    subject: "Account Activation",
    text: `Click the following link to change your password: ${passwordResetLink}`,
  };
  await transporter.sendMail(mailOptions);
  res.status(201).json(employeeResults);
};
