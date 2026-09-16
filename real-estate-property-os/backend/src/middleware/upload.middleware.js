const multer = require("multer");
const path = require("path");
const fs = require("fs");

const propertyDir = path.join(__dirname, "../../uploads/properties");
const proofDir = path.join(__dirname, "../../uploads/photo-proofs");

fs.mkdirSync(propertyDir, { recursive: true });
fs.mkdirSync(proofDir, { recursive: true });

function storageFor(dir) {
  return multer.diskStorage({
    destination: (_, __, cb) => cb(null, dir),
    filename: (_, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-");
      cb(null, `${Date.now()}-${safe}`);
    }
  });
}

const imageFilter = (_, file, cb) => {
  if (/^image\/(jpeg|png|webp|jpg)$/.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG, PNG and WebP images are allowed"));
};

module.exports = {
  propertyUpload: multer({ storage: storageFor(propertyDir), fileFilter: imageFilter, limits: { files: 10, fileSize: 8 * 1024 * 1024 } }),
  proofUpload: multer({ storage: storageFor(proofDir), fileFilter: imageFilter, limits: { fileSize: 8 * 1024 * 1024 } })
};
