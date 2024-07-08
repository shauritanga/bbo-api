const CDS = require("../models/cds.js");
module.exports.createCDS = async (req, res) => {
  //Validate inputs
  try {
    const cds = new CDS({
      ...req.body,
    });
    const cdsResult = await cds.save();
    if (!cdsResult) {
      return res
        .status(500)
        .json({ success: false, message: "Ooops! something went wrong" });
    }
    res.status(200).json({ success: true, data: cdsResult });
  } catch (error) {
    console.log(error);
  }
};
