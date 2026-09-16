const Property = require("../models/Property");
const Lead = require("../models/Lead");
const SiteVisit = require("../models/SiteVisit");

exports.summary = async (req, res) => {
  const companyId = req.user.companyId;
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(start); end.setDate(end.getDate() + 1);

  const [totalProperties, available, sold, rented, siteVisitsToday, hotLeads, scheduled, completed, hotLeadRows, todayVisits] = await Promise.all([
    Property.countDocuments({ companyId }),
    Property.countDocuments({ companyId, status: "available" }),
    Property.countDocuments({ companyId, status: "sold" }),
    Property.countDocuments({ companyId, status: "rented" }),
    SiteVisit.countDocuments({ companyId, visitDate: { $gte: start, $lt: end } }),
    Lead.countDocuments({ companyId, score: "hot" }),
    SiteVisit.countDocuments({ companyId, status: "scheduled" }),
    SiteVisit.countDocuments({ companyId, status: "completed" }),
    Lead.find({ companyId, score: "hot" }).populate("propertyId", "title price location").sort({ createdAt: -1 }).limit(10),
    SiteVisit.find({ companyId, visitDate: { $gte: start, $lt: end } }).populate("propertyId", "title location").sort({ visitDate: 1 })
  ]);

  const conversion = scheduled + completed ? Number(((completed / (scheduled + completed)) * 100).toFixed(2)) : 0;
  res.json({
    success: true,
    data: {
      properties: { total: totalProperties, available, sold, rented },
      siteVisits: { today: siteVisitsToday, scheduled, completed },
      leads: { hot: hotLeads },
      conversion,
      hotLeads: hotLeadRows,
      todaySiteVisits: todayVisits
    }
  });
};
