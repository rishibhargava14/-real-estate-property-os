require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
    require("./jobs");
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
})();
