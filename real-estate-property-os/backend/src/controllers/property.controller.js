const Property = require("../models/Property");
const Company = require("../models/Company");

exports.create = async (req, res) => {
  const { title, type, category, price, area, location, lat, lng } = req.body;
  if (!title || !type || !category || price === undefined || area === undefined || !location || lat === undefined || lng === undefined) {
    return res.status(400).json({ success: false, message: "Missing required property fields" });
  }

  let amenities = [];
  if (req.body.amenities) {
    try { amenities = JSON.parse(req.body.amenities); } catch { amenities = String(req.body.amenities).split(",").map(x => x.trim()).filter(Boolean); }
  }

  const images = (req.files || []).map(file => ({ fileUrl: `/uploads/properties/${file.filename}` }));
  const property = await Property.create({
    companyId: req.user.companyId, title, type, category,
    price: Number(price), area: Number(area), location,
    lat: Number(lat), lng: Number(lng), amenities, images
  });

  res.status(201).json({ success: true, data: property });
};

exports.list = async (req, res) => {
  const filter = { companyId: req.user.companyId };
  if (req.query.type) filter.type = req.query.type;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.status) filter.status = req.query.status;

  if (req.query.budget) {
    const budgets = { "10L": 1000000, "20L": 2000000, "50L": 5000000, "1Cr": 10000000 };
    if (budgets[req.query.budget]) filter.price = { $lte: budgets[req.query.budget] };
  }

  const properties = await Property.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: properties });
};

exports.publicList = async (req, res) => {
  const company = await Company.findOne({ subdomain: req.query.subdomain }).select("name subdomain");
  if (!company) return res.status(404).json({ success: false, message: "Company not found" });

  const filter = { companyId: company._id, status: "available" };
  if (req.query.type) filter.type = req.query.type;
  if (req.query.category) filter.category = req.query.category;

  const budgets = { "10L": 1000000, "20L": 2000000, "50L": 5000000, "1Cr": 10000000 };
  if (budgets[req.query.budget]) filter.price = { $lte: budgets[req.query.budget] };

  const properties = await Property.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: { company, properties } });
};

exports.getOne = async (req, res) => {
  const property = await Property.findOne({ _id: req.params.id, companyId: req.user.companyId });
  if (!property) return res.status(404).json({ success: false, message: "Property not found" });
  res.json({ success: true, data: property });
};

exports.updateStatus = async (req, res) => {
  const property = await Property.findOneAndUpdate(
    { _id: req.params.id, companyId: req.user.companyId },
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!property) return res.status(404).json({ success: false, message: "Property not found" });
  res.json({ success: true, data: property });
};

exports.incrementView = async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
  if (!property) return res.status(404).json({ success: false, message: "Property not found" });
  res.json({ success: true, views: property.views });
};
