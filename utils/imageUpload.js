const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "elearningimage",
  api_key: "283872252246898",
  api_secret: "fSnWkUkOLkaDyezVTV6J_sVoG7Y",
  secure: true,
});

module.exports = cloudinary