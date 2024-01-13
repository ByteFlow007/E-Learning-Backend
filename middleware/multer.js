const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, fileName + "-" + file.originalname); // Use the original filename here if needed
  },
});
const upload = multer({ storage: storage });

module.exports = upload;
