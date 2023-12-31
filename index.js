//Import Statements
const app = require("./app.js");
const jwt = require("jsonwebtoken");
const connectDB = require("./db/index.js");
const { userAuth, adminAuth, auth } = require("./middleware/index.js");
const Admin = require("./modal/Admin/admin.modal.js");
const User = require("./modal/User/user.modal.js");
const Course = require("./modal/Course/course.modal.js");
const ApiResponse = require("./utils/ApiResponse.js");
const ApiError = require("./utils/ApiError.js");

//dotenv configuration
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

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

app.get("/admin", auth, adminAuth, async (req, res) => {
  const admin = await Admin.find();
  res.json({ admin });
});

app.post("/admin/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      const data = await new Admin({ email, username, password }).save();
      return res.json(new ApiResponse(200, data, "Admin Sign-Up Successful!"));
    }
    res.json(new ApiError(400, "Admin Already Exist", []));
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
});

app.post("/admin/signin", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body; // Updated variable name
    const admin = await Admin.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      password: password,
    });
    if (!admin) {
      return res.status(404).json({ message: "Invalid Credentials!" });
    }
    const token = jwt.sign({ usernameOrEmail, role: "admin" }, secretKey, {
      expiresIn: "1h",
    });
    res.json(new ApiResponse(200, token, "Admin Sign-Up Successful!"));
  } catch (err) {
    res.json(
      new ApiError(404, "Code error in signin route", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
});

app.put("/admin/update/:adminId", auth, adminAuth, async (req, res) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;
    const admin = await Admin.findById(req.params.adminId);
    if (admin.password === password) {
      if (newPassword === confirmPassword) {
        await Admin.findByIdAndUpdate(
          req.params.adminId,
          { password: newPassword },
          { new: true }
        );
        return res.json(
          new ApiResponse(200, admin, "Password updated succesfull")
        );
      }
      return res.json({
        message: "newPassword and confirmPassword is not matching",
      });
    }
    res.json({ message: "Password in wrong" });
  } catch (e) {
    res.json(
      new ApiError(404, "Code error in update route", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
});

app.delete("/admin/:adminId", auth, adminAuth, async (req, res) => {
  try {
    const admin_id = req.params.adminId;
    const admin = Admin.findById(admin_id);
    if (admin) {
      await Admin.findByIdAndDelete(admin_id);
      return res.json(new ApiResponse(200, admin, "Admin Deleted"));
    }
    res.json({ message: "Admin not present" });
  } catch (e) {
    res.json(
      new ApiError(404, "Code error in delete route", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
});

// User routes --------------------------------------------------------------------------------------------

app.get("/user", auth, adminAuth, async (req, res) => {
  const user = await User.find();
  res.json({ user });
});

app.post("/user/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const data = await new User({ email, username, password }).save();
      return res.json(new ApiResponse(200, data, "User Sign-Up Successful!"));
    }
    res.status(400).json(new ApiError(400, "User Already Exist!"));
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
});

app.post("/user/signin", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body; // Updated variable name
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      password: password,
    });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials!" });
    }
    const token = jwt.sign({ usernameOrEmail, role: "user" }, secretKey, {
      expiresIn: "1h",
    });
    res.json(new ApiResponse(200, token, "Admin Sign-Up Successful!"));
  } catch (err) {
    res.json(
      new ApiError(404, "Code error in signin route", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
});

app.put("/user/update/:userId", auth, userAuth, async (req, res) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.params.userId);
    if (user.password === password) {
      if (newPassword === confirmPassword) {
        await User.findByIdAndUpdate(
          req.params.userId,
          { password: newPassword },
          { new: true }
        );
        return res.json(
          new ApiResponse(200, admin, "Password updated succesfull")
        );
      }
      return res.json({
        message: "newPassword and confirmPassword is not matching",
      });
    }
    res.json({ message: "Password in wrong" });
  } catch (e) {
    res.json(
      new ApiError(404, "Code error in update route", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
});

app.delete("/user/:userId", auth, userAuth, async (req, res) => {
  try {
    const user_id = req.params.userId;
    const user = User.findById(user_id);
    if (user) {
      await User.findByIdAndDelete(user_id);
      return res.json(new ApiResponse(200, admin, "Admin Deleted"));
    }
    res.json({ message: "User not present" });
  } catch (e) {
    res.json(
      new ApiError(404, "Code error in delete route", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
});

//Course Route ------------------------------------------------------------------------------------

app.get("/course", async (req, res) => {
  const course = await Course.find();
  res.json(course);
});

//--------------------------------------------------------------------------------------------------
