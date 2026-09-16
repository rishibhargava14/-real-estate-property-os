exports.send = async (req, res) => {
  const { type, phone, message } = req.body;
  if (!type || !phone) return res.status(400).json({ success: false, message: "type and phone are required" });

  // Provider-specific WhatsApp integration can be added here.
  // Keep credentials in environment variables.
  res.json({
    success: true,
    message: "WhatsApp request accepted",
    data: { type, phone, message: message || "" }
  });
};
