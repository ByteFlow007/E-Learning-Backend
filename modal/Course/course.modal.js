const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    discription: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
