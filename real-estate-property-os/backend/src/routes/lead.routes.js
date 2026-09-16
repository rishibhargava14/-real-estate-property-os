const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/lead.controller");

router.post("/create", controller.create);
router.get("/list", auth, controller.list);
router.patch("/:id/status", auth, controller.updateStatus);

module.exports = router;
