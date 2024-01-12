const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "elearningimage",
  api_key: "283872252246898",
  api_secret: "fSnWkUkOLkaDyezVTV6J_sVoG7Y",
  secure: true,
});

cloudinary.uploader.upload(
  "../public/videoplayback.mp4",
  { resource_type: "auto", public_id: "Files" },
  function (error, result) {
    console.log(error);
    console.log(result);
  }
);

// cloudinary.uploader.upload(
//   "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" },
//   function (error, result) {
//     console.log(result);
//   }
// );
