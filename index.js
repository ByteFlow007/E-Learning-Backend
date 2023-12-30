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
  res.json({ data: admin });
});

app.listen(PORT, () => {
  console.log(`Server: ${PORT}`);
});
