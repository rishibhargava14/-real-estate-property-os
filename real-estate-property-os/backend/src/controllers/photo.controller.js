const PhotoProof = require("../models/PhotoProof");
const Property = require("../models/Property");

exports.upload = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "Photo is required" });
  const { propertyId, lat, lng, type } = req.body;
  const property = await Property.findOne({ _id: propertyId, companyId: req.user.companyId });
  if (!property) return res.status(404).json({ success: false, message: "Property not found" });

  const proof = await PhotoProof.create({
    propertyId, photoUrl: `/uploads/photo-proofs/${req.file.filename}`,
    lat: lat !== undefined ? Number(lat) : undefined,
    lng: lng !== undefined ? Number(lng) : undefined,
    type
  });
  res.status(201).json({ success: true, data: proof });
};

exports.list = async (req, res) => {
  const property = await Property.findOne({ _id: req.query.propertyId, companyId: req.user.companyId });
  if (!property) return res.status(404).json({ success: false, message: "Property not found" });
  const proofs = await PhotoProof.find({ propertyId: property._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: proofs });
};
