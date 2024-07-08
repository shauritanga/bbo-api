const mongoose = require("mongoose");
const Counter = require("./counter/counter.js");
const reportSchema = mongoose.Schema({
  orderId: { type: String, unique: true },
  title: String,
  recipients: { type: Number, default: 0 },
  status: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

reportSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "orderId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seq = String(counter.seq).padStart(5, "0");
    doc.orderId = `RPT${seq}`;
  }
  next();
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
