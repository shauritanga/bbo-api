const Brokerage = require("../models/brokerage.js");
module.exports.createBrokerage = async (req, res) => {
  //Validate inputs
  try {
    const brokerage = new Brokerage({
      ...req.body,
    });
    const brokerageResult = await brokerage.save();
    if (!brokerageResult) {
      return res
        .status(500)
        .json({ success: false, message: "Ooops! something went wrong" });
    }
    res.status(200).json({ success: true, data: brokerageResult });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getAllBrokerage = async (req, res) => {
  const brokerage = await Brokerage.find({});
  if (!brokerage) {
    return res.status(404).json({ message: "Data not found" });
  }
  res.status(200).json(brokerage);
};
