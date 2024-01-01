const Admin = require("../modal/Admin/admin.modal.js");
const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.find();
    return res.json(new ApiResponse(200, admin, "All Admin."));
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in signup route.", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

const signupAdmin = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      const data = await new Admin({ email, username, password }).save();
      return res.json(new ApiResponse(200, data, "Admin Signup Successful."));
    }
    return res.json(new ApiError(400, "Admin Already Exist."));
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in signup route.", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

const signinAdmin = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body; // Updated variable name
    const admin = await Admin.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      password: password,
    });
    if (!admin) {
      return res.json(new ApiError(400, "Invalid Credentials."));
    }
    const token = jwt.sign({ usernameOrEmail, role: "admin" }, secretKey, {
      expiresIn: "1h",
    });
    return res.json(new ApiResponse(200, token, "Admin Signin Successful."));
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in signin route.", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;
    const admin = await Admin.findById(req.params.adminId);
    if (admin.password === password) {
      if (newPassword === confirmPassword) {
        await Admin.findByIdAndUpdate(
          req.params.adminId,
          { password: newPassword },
          { new: true }
        );
        return res.json(
          new ApiResponse(200, admin, "Password updated succesfully.")
        );
      }
      return res.json(
        new ApiError(400, "newPassword and confirmPassword is not matching.")
      );
    }
    return res.json(new ApiError(400, "Wrong Password."));
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in update route", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const admin_id = req.params.adminId;
    const admin = await Admin.findById(admin_id);
    if (admin) {
      await Admin.findByIdAndDelete(admin_id);
      return res.json(new ApiResponse(200, admin, "Admin Deleted"));
    }
    return res.json(new ApiError(400, "Admin not present."));
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in delete route.", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

module.exports = {
  getAdmin,
  signupAdmin,
  signinAdmin,
  updateAdmin,
  deleteAdmin,
};
