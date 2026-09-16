const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const controller = require("../controllers/photo.controller");

router.post("/upload", auth, upload.proofUpload.single("photo"), controller.upload);
router.get("/list", auth, controller.list);

module.exports = router;
