// File: mainApp.js
const express = require("express");
const app=express();
const { userAuth, adminAuth, auth } = require("./middleware/index.js");
const Admin = require("./modal/Admin/admin.modal.js");
const User = require("./modal/User/user.modal.js");
const Course = require("./modal/Course/course.modal.js");
const connectDB = require("./db/index.js");
const jwt = require("jsonwebtoken");
const cors=require('cors');
require("dotenv").config();
connectDB();
app.use(cors());
const PORT = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY;
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
      return res.json({messgae:"Admin Registered."});
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
      return res.status(404).json({message:"Invalid Credentials!"});
    }
    const token = jwt.sign({ usernameOrEmail, role: "admin" }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ message: "Signin Successful", token });
  } catch (err) {
    res.json({ err, errMessage: "Error!" });
  }
});

app.put("/admin/update/:userId",auth,adminAuth,async(req,res)=>{
  try{
    const{password,newPassword,confirmPassword}=req.body;
    const user=await Admin.findById(req.params.userId);
   if(user.password===password){
   
    if(newPassword===confirmPassword){
      
      await Admin.findByIdAndUpdate(req.params.userId,{password:newPassword},{new:true});
      return res.json({message:"Password updated succesfull"});
    }
    return res.json({message:"newPassword and confirmPassword is not matching"})
   }
   res.json({message:"Password in wrong"})
  }
 catch(e){
     res.json({error:e})
 }
})
//Port Listening on --------------------------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server is running on: ${PORT}`);
});
