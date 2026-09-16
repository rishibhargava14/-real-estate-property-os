const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  userAction: { type: String, required: true },
  entityType: { type: String, enum: ["property", "lead", "site_visit", "photo", "whatsapp"] },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  metadata: { type: mongoose.Schema.Types.Mixed },
  ipAddress: String
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", schema);
