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

app.post("/admin/signup", signupAdmin);

app.post("/admin/signin", signinAdmin);

app.put("/admin/update/:adminId", adminAuth, auth, updateAdmin);

app.delete("/admin/:adminId", adminAuth, auth, deleteAdmin);

app.post("/admin/createCourse", adminAuth, auth, createCourse);

app.delete("/admin/delete/:courseId", adminAuth, auth, deleteCourse);

// User routes --------------------------------------------------------------------------------------------

app.get("/user", getUser);

app.post("/user/signup", signupUser);

app.post("/user/signin", signinUser);

app.put("/user/update/:userId", userAuth, auth, updateUser);

app.delete("/user/:userId", userAuth, auth, deleteUser);

app.get("/user/publishedcourse", userAuth, auth, publishedCourse);

//Course Route ------------------------------------------------------------------------------------

app.get("/course", getCourse);
