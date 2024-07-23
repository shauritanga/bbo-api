const express = require("express");
const multer = require("multer");
const path = require("path");
const File = require("../models/file.js");
const Customer = require("../models/customer.js");

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // Keep original extension
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.array("files", 5), async (req, res) => {
  console.log(req.body);
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }
    const user = await Customer.findOne({ _id: req.body.user });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const files = req.files;
    const savedFiles = await Promise.all(
      files.map(async (file) => {
        const upload = File({
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
        });

        const savedFile = await upload.save();
        user.files.push(savedFile._id);
        user.bankAccount = req.body.account;
        user.bankName = req.body.bank;
        user.country = req.body.country;
        user.dob = req.body.dob;
        user.address = req.body.address;
        user.idType = req.body.idType;
        user.idNumber = req.body.idNumber;
        user.region = req.body.region;
        user.occupation = req.body.occupation;
        user.box = req.body.box;
        user.isEmployed = req.body.isEmployed;
        user.nextOfKinName = req.body.nextOfKinName;
        user.nextOfKinRelation = req.body.nextOfKinRelation;
        user.nextOfKinResident = req.body.nextOfKinResident;
        user.nextOfKinRegion = req.body.nextOfKinRegion;
        user.nextOfKinEmail = req.body.nextOfKinEmail;
        user.nextOfKinMobile = req.body.nextOfKinMobile;
        user.profileComplete = true;
        return savedFile;
      })
    );
    await user.save();

    return res.status(200).json({
      message: "Files uploaded and saved to database successfully.",
      files: savedFiles,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
