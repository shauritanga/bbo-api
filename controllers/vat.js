const VAT = require("../models/vat.js");
module.exports.createVAT = async (req, res) => {
  //Validate inputs
  try {
    const vat = new VAT({
      ...req.body,
    });
    const vatResult = await vat.save();
    if (!vatResult) {
      return res
        .status(500)
        .json({ success: false, message: "Ooops! something went wrong" });
    }
    res.status(200).json({ success: true, data: vatResult });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getVAT = async (req, res) => {
  const vat = await VAT.find({}, { __v: 0 });
  if (!vat) {
    return res
      .status(500)
      .json({ success: false, message: "Ooops! something went wrong" });
  }
  res.status(200).json(vat);
};

module.exports.getVATMonthly = async (req, res) => {
  const month = req.query.month;
  const intMonth = parseInt(month);

  const startDate = new Date(2024, intMonth, 1);
  const endDate = new Date(2024, intMonth + 1, 0, 23, 59, 59);
  console.log(startDate, endDate);
  try {
    const data = await VAT.find(
      {
        date: { $gte: startDate, $lt: endDate },
      },
      { __v: 0 }
    );
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};
