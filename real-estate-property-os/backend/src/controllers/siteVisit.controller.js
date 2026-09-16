const SiteVisit = require("../models/SiteVisit");
const Property = require("../models/Property");

exports.create = async (req, res) => {
  const { propertyId, customerName, phone, visitDate, slot, agentName } = req.body;
  const property = await Property.findOne({ _id: propertyId, companyId: req.body.companyId || req.user?.companyId });
  const companyId = req.user?.companyId || property?.companyId || req.body.companyId;

  if (!property) return res.status(404).json({ success: false, message: "Property not found" });
  if (!customerName || !phone || !visitDate || !slot) return res.status(400).json({ success: false, message: "Missing required site visit fields" });

  const booked = await SiteVisit.findOne({ propertyId, visitDate: new Date(visitDate), slot, status: "scheduled" });
  if (booked) return res.status(409).json({ success: false, message: "This slot is already booked" });

  const visit = await SiteVisit.create({
    companyId, propertyId, customerName, phone, visitDate, slot, agentName,
    lat: property.lat, lng: property.lng
  });

  res.status(201).json({ success: true, data: visit });
};

exports.list = async (req, res) => {
  const filter = { companyId: req.user.companyId };
  if (req.query.date) {
    const start = new Date(req.query.date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filter.visitDate = { $gte: start, $lt: end };
  }
  const visits = await SiteVisit.find(filter).populate("propertyId", "title location price").sort({ visitDate: 1 });
  res.json({ success: true, data: visits });
};

exports.stats = async (req, res) => {
  const companyId = req.user.companyId;
  const [total, scheduled, completed] = await Promise.all([
    SiteVisit.countDocuments({ companyId }),
    SiteVisit.countDocuments({ companyId, status: "scheduled" }),
    SiteVisit.countDocuments({ companyId, status: "completed" })
  ]);
  const conversion = total ? Number(((completed / total) * 100).toFixed(2)) : 0;
  res.json({ success: true, data: { total, scheduled, completed, conversion } });
};

exports.updateStatus = async (req, res) => {
  const allowed = ["completed", "cancelled"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid status" });
  const visit = await SiteVisit.findOneAndUpdate(
    { _id: req.params.id, companyId: req.user.companyId },
    { status: req.body.status },
    { new: true }
  );
  if (!visit) return res.status(404).json({ success: false, message: "Site visit not found" });
  res.json({ success: true, data: visit });
};
