const Account = require("../models/account.js");

const createAccount = async (req, res) => {
  try {
    const account = Account({
      ...req.body,
    });
    await account.save();
    res.status(201).json({ message: "Account successfully added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({}).sort({ name: 1 });
    res.status(201).json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAccount, getAllAccounts };
