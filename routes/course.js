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
  try {
    const { title, description, image, price, isPublished } = req.body;
    const username = req.user.usernameOrEmail;
    const admin = await Admin.findOne({
      $or: [{ username: username }, { email: username }],
    });
    if (admin) {
      const createdBy = admin;
      // Create an instance of the Course model
      const course = await new Course({
        title,
        description,
        image,
        price,
        isPublished,
        createdBy,
      }).save();
      admin.courseCreated.push(course);
      await admin.save();
      return res.json(
        new ApiResponse(200, course, "Course Created Successfully.")
      );
    }
    res.json(new ApiError(400, "Admin not found"));
  } catch (err) {
    res.json(
      new ApiError(404, "Code error in course creation route", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

const deleteCourse = async (req, res) => {
  try {
    const username = req.user.usernameOrEmail;
    const admin = await Admin.findOne({
      $or: [{ username: username }, { email: username }],
    });
    const courseid = req.params.courseId;
    const find_course = admin.courseCreated.includes(courseid);
    if (find_course) {
      const index = admin.courseCreated.indexOf(courseid);
      const course = Course.findById(courseid);
      if (course) {
        const deletedCourse = await Course.findByIdAndDelete(courseid);
        admin.courseCreated.splice(index, 1);
        await admin.save();
        return res.json(
          new ApiResponse(200, deletedCourse, "Course Deleted Successfully.")
        );
      }
      return res.json(new ApiError(400, "Course not found"));
    } else {
      res.json(new ApiError(400, "Admin not found"));
    }
  } catch (err) {
    res.json(
      new ApiError(404, "Code error in course creation route", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

const publishedCourse = async (req, res) => {
  try {
    const publishedCourse = await Course.find({ isPublished: true });
    res.send(new ApiResponse(200, publishedCourse, "All published courses."));
  } catch (err) {
    res.json(
      new ApiError(404, "Code error in course creation route", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

module.exports = { getCourse, createCourse, deleteCourse, publishedCourse };
