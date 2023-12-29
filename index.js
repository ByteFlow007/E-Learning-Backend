const express = require("express");
const mongoose = require("mongoose");
const Admin = require("./modal/admin.modal.js");
const app = express();


require("dotenv").config();
const PORT = process.env.PORT || 3000;
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", async (req, res) => {
  const data = await Admin.find();
  res.json({data: data});
});

app.listen(PORT, () => {
  console.log(`Server: ${PORT}`);
});
