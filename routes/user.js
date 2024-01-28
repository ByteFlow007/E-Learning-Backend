const User = require("../modal/User/user.modal.js");
const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");
const { signupSchema, signinSchema } = require("../utils/ZodSchema.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = process.env.SECRET_KEY;
const saltRounds = 10;

const getUser = async (req, res) => {
  try {
    const user = await User.find();
    return res.json(new ApiResponse(200, user, "All Users."));
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in getUser route.", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

//User Signup Route function

const signupUser = async (req, res) => {
  try {
    const typeCheck = signupSchema.safeParse(req.body);
    if (!typeCheck.success) {
      return res.json(new ApiError(400, typeCheck.error.issues[0].message));
    }
    const { email, username, password } = typeCheck.data;
    const user = await User.findOne({ email });
    if (!user) {
      const hashPassword = await bcrypt.hash(password, saltRounds);
      const data = await new User({
        email,
        username,
        password: hashPassword,
      }).save();
      return res.json(new ApiResponse(200, data, "User Sign-Up Successful."));
    }
    return res.json(new ApiError(400, "User Already Exist."));
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in signupUser route.", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

//User Signin Route function

const signinUser = async (req, res) => {
  try {
    const typeCheck = signinSchema.safeParse(req.body);
    if (!typeCheck.success) {
      return res.json(new ApiError(400, typeCheck.error.issues[0].message));
    }
    const { usernameOrEmail, password } = typeCheck.data; // Updated variable name
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail.toLowerCase() }],
    });
    if(!user){
      return res.json(new ApiError(400, "Invalid Username."))
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json(new ApiError(400, "Invalid Password."));
    }
    const token = jwt.sign({ usernameOrEmail, role: "user" }, secretKey, {
      expiresIn: "1h",
    });
    return res.json(new ApiResponse(200, token, "User Sign-In Successful."));
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in signinUser route.", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

//User Password Update Route function

const updateUser = async (req, res) => {
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
          new ApiResponse(200, user, "Password updated Succesfully.")
        );
      }
      return res.json({
        message: "New Password And Confirm Password Is Not Matching.",
      });
    }
    return res.json({ message: "Wrong Password." });
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in updateUser route", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

//User Delete Route function

const deleteUser = async (req, res) => {
  try {
    const user_id = req.params.userId;
    const user = User.findById(user_id);
    if (user) {
      await User.findByIdAndDelete(user_id);
      return res.json(new ApiResponse(200, user, "User Deleted."));
    }
    return res.json({ message: "User Not Present." });
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in deleteUser route.", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

//User All Bought Courses

const myCourses = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail.toLowerCase() }],
    }).populate(
      "coursePurchased"
    );
    if (!user) {
      return res.json(new ApiError(404, "User Not Found."));
    }
    const courses = user.coursePurchased;
    return res.send(new ApiResponse(200, courses, "My Purchased Courses."));
  } catch (err) {
    return res.send(
      new ApiError(404, "Code error in myCourses route.", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

module.exports = {
  getUser,
  signupUser,
  signinUser,
  updateUser,
  deleteUser,
  myCourses,
};
