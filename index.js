//dotenv configuration
require("dotenv").config();

//Import Statements
const app = require("./app.js");
const connectDB = require("./db/index.js");
const { userAuth, adminAuth, auth } = require("./middleware/index.js");
const {
  getAdmin,
  signupAdmin,
  signinAdmin,
  updateAdmin,
  deleteAdmin,
  allStudents,
} = require("./routes/admin.js");
const {
  getUser,
  signupUser,
  signinUser,
  updateUser,
  deleteUser,
} = require("./routes/user.js");
const {
  getCourse,
  createCourse,
  deleteCourse,
  publishedCourse,
  purchaseCourse,
  myCourses,
  updateCourse,
} = require("./routes/course.js");

//database connection
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on: ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.log("Database connection error!");
  });

// Admin Routes--------------------------------------------------------------------------------

app.get("/admin", getAdmin);

app.get("/admin/student/:adminId", allStudents);

app.post("/admin/signup", signupAdmin);

app.post("/admin/signin", signinAdmin);

app.put("/admin/update/:adminId", auth, adminAuth, updateAdmin);

app.delete("/admin/:adminId", auth, adminAuth, deleteAdmin);

// User routes --------------------------------------------------------------------------------------------

app.get("/user", getUser);

app.get("/user/mycourses/:userId", auth, userAuth, myCourses);

app.post("/user/signup", signupUser);

app.post("/user/signin", signinUser);

app.put("/user/update/:userId", auth, userAuth, updateUser);

app.delete("/user/:userId", auth, userAuth, deleteUser);

//Course Route ------------------------------------------------------------------------------------

app.get("/course", getCourse);

app.get("/user/publishedcourse", auth, userAuth, publishedCourse);

app.post("/admin/createCourse", auth, adminAuth, createCourse);

app.post("/user/purchasecourse/:courseId", auth, userAuth, purchaseCourse);

app.put("/admin/:courseId", auth, adminAuth, updateCourse);

app.delete("/admin/delete/:courseId", auth, adminAuth, deleteCourse);
