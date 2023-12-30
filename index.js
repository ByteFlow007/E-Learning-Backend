//Import Statements
const app = require("./app.js");
const jwt = require("jsonwebtoken");
const connectDB = require("./db/index.js");
const { userAuth, adminAuth, auth } = require("./middleware/index.js");
const Admin = require("./modal/Admin/admin.modal.js");
const User = require("./modal/User/user.modal.js");
const Course = require("./modal/Course/course.modal.js");

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
      return res.json({ messgae: "Admin Registered." });
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
      return res.status(404).json({ message: "Invalid Credentials!" });
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

app.delete("/admin/:adminId",async(req,res)=>{
  try{
    
    const admin_id=req.params.adminId;
    const admin=Admin.findById(admin_id);
    if(admin){
      const delAdmin=await Admin.findByIdAndDelete(admin_id);
      return res.json({message:"Admin Deleted"})
    }
    res.json({message:"Admin not present"})
  }
  catch(e){
    res.json({error:e})
  }
})