const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Company = require("../models/Company");

function tokenFor(company) {
  return jwt.sign(
    { companyId: company._id.toString(), email: company.ownerEmail },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

exports.register = async (req, res) => {
  const { name, subdomain, ownerEmail, password } = req.body;
  if (!name || !subdomain || !ownerEmail || !password) {
    return res.status(400).json({ success: false, message: "name, subdomain, ownerEmail and password are required" });
  }

  const exists = await Company.findOne({
    $or: [{ ownerEmail: ownerEmail.toLowerCase() }, { subdomain: subdomain.toLowerCase() }]
  });
  if (exists) return res.status(409).json({ success: false, message: "Email or subdomain already exists" });

  const passwordHash = await bcrypt.hash(password, 12);
  const company = await Company.create({
    name, subdomain: subdomain.toLowerCase(), ownerEmail: ownerEmail.toLowerCase(), passwordHash
  });

  res.status(201).json({
    success: true,
    token: tokenFor(company),
    company: { id: company._id, name: company.name, subdomain: company.subdomain, ownerEmail: company.ownerEmail }
  });
};

exports.login = async (req, res) => {
  const { ownerEmail, password } = req.body;
  const company = await Company.findOne({ ownerEmail: ownerEmail?.toLowerCase() });
  if (!company || !(await bcrypt.compare(password || "", company.passwordHash))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  res.json({
    success: true,
    token: tokenFor(company),
    company: { id: company._id, name: company.name, subdomain: company.subdomain, ownerEmail: company.ownerEmail }
  });
};
