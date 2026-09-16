const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ["sale", "rent"], required: true, index: true },
  category: { type: String, enum: ["1BHK", "2BHK", "Plot", "Shop"], required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  area: { type: Number, required: true, min: 0 },
  location: { type: String, required: true, trim: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  amenities: [String],
  images: [{ fileUrl: String }],
  status: { type: String, enum: ["available", "sold", "rented"], default: "available", index: true },
  views: { type: Number, default: 0 }
}, { timestamps: true });

schema.index({ companyId: 1, createdAt: -1 });
schema.index({ companyId: 1, type: 1, category: 1, status: 1 });

module.exports = mongoose.model("Property", schema);
