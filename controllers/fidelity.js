const Fidelity = require("../models/fidelity.js");
module.exports.createFidelity = async (req, res) => {
  //Validate inputs
  try {
    const fidelity = new Fidelity({
      ...req.body,
    });
    const fidelityResult = await fidelity.save();
    if (!fidelityResult) {
      return res
        .status(500)
        .json({ success: false, message: "Ooops! something went wrong" });
    }
    res.status(200).json({ success: true, data: fidelityResult });
  } catch (error) {
    console.log(error);
  }
};
