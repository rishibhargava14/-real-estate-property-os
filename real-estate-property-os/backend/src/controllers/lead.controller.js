const Lead = require("../models/Lead");
const Property = require("../models/Property");
const { scoreLead } = require("../utils/scoring");

exports.create = async (req, res) => {
  const { propertyId, name, phone, budgetRange, message } = req.body;
  let property = null;
  if (propertyId) property = await Property.findById(propertyId);

  const companyId = property?.companyId || req.user?.companyId || req.body.companyId;
  if (!companyId || !name || !phone || !budgetRange) {
    return res.status(400).json({ success: false, message: "Missing required lead fields" });
  }

  const score = property ? scoreLead(budgetRange, property.price) : "cold";
  const lead = await Lead.create({
    companyId, propertyId: property?._id || null, name, phone, budgetRange, message, score
  });

  res.status(201).json({ success: true, data: lead });
};

exports.list = async (req, res) => {
  const filter = { companyId: req.user.companyId };
  if (req.query.score) filter.score = req.query.score;
  if (req.query.status) filter.status = req.query.status;
  const leads = await Lead.find(filter).populate("propertyId", "title price location").sort({ createdAt: -1 });
  res.json({ success: true, data: leads });
};

exports.updateStatus = async (req, res) => {
  const lead = await Lead.findOneAndUpdate(
    { _id: req.params.id, companyId: req.user.companyId },
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
  res.json({ success: true, data: lead });
};
