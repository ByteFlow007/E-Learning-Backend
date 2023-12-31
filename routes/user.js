const User = require("../modal/User/user.modal.js");
const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const getUser = async (req, res) => {
  try {
    const user = await User.find();
    res.json(new ApiResponse(200, user, "All Users."));
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
};

const signupUser = async (req, res) => {
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
};

const signinUser = async (req, res) => {
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
    res.json(new ApiResponse(200, token, "User Sign-Up Successful!"));
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
};

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
          new ApiResponse(200, user, "Password updated succesfull")
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
};

const deleteUser = async (req, res) => {
  try {
    const user_id = req.params.userId;
    const user = User.findById(user_id);
    if (user) {
      await User.findByIdAndDelete(user_id);
      return res.json(new ApiResponse(200, user, "User Deleted"));
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
};

module.exports = { getUser, signupUser, signinUser, updateUser, deleteUser };
