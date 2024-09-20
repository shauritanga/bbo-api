const crypto = require("crypto");
module.exports.generateActivationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
