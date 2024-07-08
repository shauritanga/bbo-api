const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const router = express.Router();

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  path: String,
});

const File = mongoose.model("File", fileSchema);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

router.post("/upload", upload.array("file", 12), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  try {
    const fileDocs = req.files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    }));

    await File.insertMany(fileDocs);

    res.status(200).send("Files uploaded and saved to database successfully.");
  } catch (error) {
    res.status(500).send("Error uploading files and saving to database.");
  }
});

module.exports = router;
