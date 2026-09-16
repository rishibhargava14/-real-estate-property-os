const AuditLog = require("../models/AuditLog");

exports.list = async (req, res) => {
  const filter = { companyId: req.user.companyId };
  if (req.query.year) {
    const year = Number(req.query.year);
    filter.createdAt = {
      $gte: new Date(`${year}-01-01T00:00:00.000Z`),
      $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
    };
  }
  const logs = await AuditLog.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: logs });
};

exports.log = async ({ companyId, userAction, entityType, entityId, metadata, ipAddress }) =>
  AuditLog.create({ companyId, userAction, entityType, entityId, metadata, ipAddress });
