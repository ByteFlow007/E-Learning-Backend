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
    const { email, username, password } = req.body;
    const admin = await Admin.findOne({email})
    if (!admin) {
      await new Admin({ email, username, password }).save();
      return res.send("Admin Registered.");
    }
    res.status(400).json({message: "Admin already exist!"});
  } catch (err) {
    res.json({ err, errMessage: "Error!" });
  }
});

app.post("/admin/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email, password });
    if (!admin) {
      return res.status(404).send("Invalid Credentials!");
    }
    res.json({ message: "Signin Successful", admin });
  } catch (err) {
    res.json({ err, errMessage: "Error!" });
  }
});

app.listen(PORT, () => {
  console.log(`Server: ${PORT}`);
});
