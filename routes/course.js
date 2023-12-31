const Admin = require("../modal/Admin/admin.modal.js");
const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");
const Course = require("../modal/Course/course.modal.js");

const getCourse = async (req, res) => {
  try {
    const course = await Course.find();
    res.json(new ApiResponse(200, course, "All Course"));
  } catch (err) {
    res.json(
      new ApiError(404, "Code error in signup route", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

const createCourse = async (req, res) => {
  console.log(req.user);
  try {
    const { title, description, image, price, isPublished } = req.body;
    const username = req.user.usernameOrEmail;
    const admin = await Admin.findOne({
      $or: [{ username: username }, { email: username }],
    });
    if (admin) {
      const createdBy = admin._id;
      // Create an instance of the Course model
      const course = new Course({
        title,
        description,
        image,
        price,
        isPublished,
        createdBy,
      });
      // Save the course instance to the database
      await course.save();
      admin.courseCreated.push(course);
      await admin.save();
      console.log(course);
      return res.json({ message: "Course is created successfully" });
    }
    res.json({ message: "Admin not found" });
  } catch (e) {
    res.json({ error: e.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseid = req.params.courseId;
    const course = Course.findById(courseid);
    if (course) {
      await Course.findByIdAndDelete(courseid);
      return res.json({ message: "Course is deleted" });
    }
    res.json({ message: "Course is not present" });
  } catch (e) {
    res.json({ error: e });
  }
};

module.exports = { getCourse, createCourse, deleteCourse };
