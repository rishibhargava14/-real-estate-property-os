const cron = require("node-cron");

// Placeholder jobs. Add the real WhatsApp provider call in whatsapp.service.js.
cron.schedule("0 8 * * *", () => {
  console.log("08:00 site-visit reminder job");
});

cron.schedule("0 18 * * *", () => {
  console.log("18:00 missed-visit job");
});
