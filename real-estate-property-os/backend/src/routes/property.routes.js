const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const controller = require("../controllers/property.controller");

router.get("/public", controller.publicList);
router.get("/list", auth, controller.list);
router.get("/:id", auth, controller.getOne);
router.post("/create", auth, upload.propertyUpload.array("images", 10), controller.create);
router.patch("/:id/status", auth, controller.updateStatus);
router.post("/:id/view", controller.incrementView);

module.exports = router;
