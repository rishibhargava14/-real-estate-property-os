const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/whatsapp.controller");

router.post("/send", auth, controller.send);

module.exports = router;
