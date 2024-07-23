const Profile = require("../models/profile.js");

const createProfile = async (req, res) => {
  console.log(req.body);
  try {
    const profile = Profile({
      ...req.body,
    });

    await profile.save();
    res.status(201).json({ message: "Profile successfully created" });
  } catch (error) {}
};

const getAllProfiles = async (req, res) => {
  try {
    const profile = await Profile.find({});
    res.status(201).json(profile);
  } catch (error) {}
};

module.exports = { createProfile, getAllProfiles };
