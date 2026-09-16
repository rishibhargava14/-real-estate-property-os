const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/audit.controller");

router.get("/export", auth, controller.list);

module.exports = router;
