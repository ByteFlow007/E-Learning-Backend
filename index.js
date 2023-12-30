const express = require("express");

const Admin = require("./modal/Admin/admin.modal.js");
const User = require("./modal/User/user.modal.js");
const Course = require("./modal/Course/course.modal.js");
const connectDB = require("./db/index.js");


require("dotenv").config();
connectDB();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  const admin = await Admin.find();

  res.json({ admin });
});

app.post("/admin/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const admin = await Admin.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (admin) {
      return res.json({ message: "Username or Email Already Exist" });
    }
    await new Admin({ username, email, password }).save();
    res.json({ message: "Admin created successfully" });
  } catch (e) {
    res.json({ error: e });
  }
});

app.post("/admin/login", async (req, res) => {
  try {
    const { usernameoremail, password } = req.body;
    const admin = await Admin.findOne({
      $or: [{ username: usernameoremail }, { email: usernameoremail }],
      password: password,
    });
    if (admin) {
      return res.json({ message: "Admin Login Successfull" });
    }
    res.json({ message: "Login failed" });
  } catch (e) {
    res.json({ error: e });
  }

});

app.listen(PORT, () => {
  console.log(`Server: ${PORT}`);
});
