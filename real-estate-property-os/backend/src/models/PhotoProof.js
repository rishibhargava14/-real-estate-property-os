const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true, index: true },
  photoUrl: { type: String, required: true },
  lat: Number,
  lng: Number,
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ["site_visit", "before", "after"], required: true }
}, { timestamps: true });

module.exports = mongoose.model("PhotoProof", schema);
