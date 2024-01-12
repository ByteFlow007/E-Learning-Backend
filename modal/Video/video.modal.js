const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
    required: false,
  },
  videoURL: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;