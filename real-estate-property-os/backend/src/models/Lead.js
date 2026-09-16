const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", default: null },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  budgetRange: { type: String, enum: ["10L", "20L", "50L", "1Cr"], required: true },
  message: { type: String, trim: true },
  source: { type: String, enum: ["Property", "WhatsApp"], default: "Property" },
  score: { type: String, enum: ["hot", "warm", "cold"], default: "cold", index: true },
  status: { type: String, enum: ["new", "contacted", "site-visit", "closed"], default: "new", index: true }
}, { timestamps: true });

schema.index({ companyId: 1, score: 1, createdAt: -1 });

module.exports = mongoose.model("Lead", schema);
