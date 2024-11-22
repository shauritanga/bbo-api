const User = require("../models/user.js");
const nodemailer = require("nodemailer");
const { generateActivationToken } = require("../utils/generateToken.js");

let transporter = nodemailer.createTransport({
  host: "mail.alphafunds.co.tz",
  // port: 587,
  auth: {
    user: "admin@alphafunds.co.tz", // replace with your email
    pass: "vct6?99^i}^]", // replace with your password
  },
});

const adminCreateCustomer = async (req, res) => {
  const {
    name,
    category,
    email,
    phone,
    idType,
    address,
    region,
    idNumber,
    cdsAccount,
    bankAccountNumber,
    bankName,
    nationality,
    password,
    occupation,
    dob,
    nextOfKinName,
    nextOfKinRelation,
    nextOfKinResidence,
    nextOfKinRegion,
    nextOfKinPhone,
    nextOfKinEmail,
  } = req.body;

  try {
    const customer = User({
      name,
      dob,
      type: category,
      idType,
      idNumber,
      address,
      nationality,
      email,
      password,
      occupation,
      phone,
      region,
      dseAccount: cdsAccount,
      bankAccountName: name,
      bankAccountNumber,
      bankName,
      nextOfKinName,
      nextOfKinRelation,
      nextOfKinResidence,
      nextOfKinRegion,
      nextOfKinPhone,
      nextOfKinEmail,
    });

    await customer.save();

    // const link = `${process.env.CLIENT_URL}/login`;

    // const mailOptions = {
    //   from: '"Alpha Capital" admin@alphafunds.co.tz',
    //   to: email,
    //   subject: "Account Creation",
    //   html: `<h6>Hi,${name}!<h6>
    //    <p>Thank you for trusting us. You account has been successfully created</p>
    //    <br/>
    //    <p>Your login credentials</p>
    //    <p>email: ${email}</p>
    //    <p>password:${password}</p>
    //    <p>Please visit ${link} to get srated!</p><br/>
    //    <em>Alpha Capital</em>
    //    `,
    // };

    // const info = await transporter.sendMail(mailOptions);
    // if (!info) {
    //   return res.status(500).json({ message: "Something went wrong" });
    // }
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminUpdateCustomer = async (req, res) => {
  const updateData = req.body;
  const userId = req.params.id;
  console.log({ updateData });

  try {
    const updates = {
      nationality: updateData.country,
      name: updateData.name,
      phone: updateData.phone,
      email: updateData.email,
      idType: updateData.idType,
      idNumber: updateData.idNumber,
      bankName: updateData.bankName,
      bankAccountNumber: updateData.bankAccount,
      dseAccount: updateData.cdsAccount,
    };

    const result = await User.findOneAndUpdate(
      { _id: userId }, // filter
      { $set: updates }, // update
      { new: true } // return the updated document
    );
    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserWallet = async (req, res) => {
  const { userWallet } = req.body;
  console.log({ userWallet });
};

module.exports = { adminCreateCustomer, updateUserWallet, adminUpdateCustomer };
