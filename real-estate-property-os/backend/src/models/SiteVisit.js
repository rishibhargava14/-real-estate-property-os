const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true, index: true },
  customerName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  visitDate: { type: Date, required: true, index: true },
  slot: { type: String, required: true },
  status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
  agentName: { type: String, trim: true },
  feedback: { type: String, trim: true },
  lat: Number,
  lng: Number
}, { timestamps: true });

schema.index({ propertyId: 1, visitDate: 1, slot: 1 });

module.exports = mongoose.model("SiteVisit", schema);
