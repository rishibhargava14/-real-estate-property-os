const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/siteVisit.controller");

router.post("/create", controller.create);
router.get("/list", auth, controller.list);
router.get("/stats", auth, controller.stats);
router.patch("/:id/status", auth, controller.updateStatus);

module.exports = router;
