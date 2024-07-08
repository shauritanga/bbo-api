const CSMA = require("../models/csma.js");
module.exports.createCSMA = async (req, res) => {
  //Validate inputs
  try {
    const dse = new CSMA({
      ...req.body,
    });
    const dseResult = await dse.save();
    if (!dseResult) {
      return res
        .status(500)
        .json({ success: false, message: "Ooops! something went wrong" });
    }
    res.status(200).json({ success: true, data: dseResult });
  } catch (error) {
    console.log(error);
  }
};
