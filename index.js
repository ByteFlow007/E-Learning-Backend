// File: mainApp.js
const express = require("express");
const { userAuth, adminAuth, auth } = require("./middleware/index.js");
const Admin = require("./modal/Admin/admin.modal.js");
const User = require("./modal/User/user.modal.js");
const Course = require("./modal/Course/course.modal.js");
const connectDB = require("./db/index.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
connectDB();

const PORT = process.env.PORT || 3000;
const app = express();
const secretKey = process.env.secret_key;
app.use(express.json());

// Admin Routes--------------------------------------------------------------------------------

app.get("/", auth, adminAuth, async (req, res) => {
  const admin = await Admin.find();
  res.json({ admin });
});

app.post("/admin/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      await new Admin({ email, username, password }).save();
      return res.send("Admin Registered.");
    }
    res.status(400).json({ message: "Admin already exist!" });
  } catch (err) {
    res.json({ err, errMessage: "Error!" });
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
      return res.status(404).send("Invalid Credentials!");
    }
    const token = jwt.sign({ usernameOrEmail, role: "admin" }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ message: "Signin Successful", token });
  } catch (err) {
    res.json({ err, errMessage: "Error!" });
  }
});

//Port Listening on --------------------------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server: ${PORT}`);
});
