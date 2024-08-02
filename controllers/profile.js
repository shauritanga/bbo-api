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
    console.log(profile);
    res.status(201).json(profile);
  } catch (error) {}
};

const getProfileByCustomerId = async (req, res) => {
  const id = req.params.id;
  try {
    const profile = await Profile.findOne({ user_id: id });
    console.log({ profile });
    res.status(201).json(profile);
  } catch (error) {}
};

module.exports = { createProfile, getAllProfiles, getProfileByCustomerId };
