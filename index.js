const express = require("express");
const mongoose = require("mongoose");
const Admin = require("./modal/admin.modal.js");
const jwt = require("jsonwebtoken");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 3000;
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
