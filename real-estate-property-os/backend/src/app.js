const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Real Estate Property OS API is running" });
});

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/properties", require("./routes/property.routes"));
app.use("/api/sitevisits", require("./routes/siteVisit.routes"));
app.use("/api/leads", require("./routes/lead.routes"));
app.use("/api/photo", require("./routes/photo.routes"));
app.use("/api/whatsapp", require("./routes/whatsapp.routes"));
app.use("/api/audit", require("./routes/audit.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));

app.use(require("./middleware/error.middleware"));

module.exports = app;
