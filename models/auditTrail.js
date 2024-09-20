const mongoose = require("mongoose");

const auditTrailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true }, // e.g., 'create', 'update', 'delete'
  resource: { type: String, required: true }, // e.g., 'orders', 'users'
  details: { type: String }, // Additional details about the action
  timestamp: { type: Date, default: Date.now }, // When the action took place
});

const AuditTrail = mongoose.model("AuditTrail", auditTrailSchema);

module.exports = AuditTrail;
