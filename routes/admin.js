const Admin = require("../modal/Admin/admin.modal.js");
const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");
const { signupSchema, signinSchema } = require("../utils/ZodSchema.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = process.env.SECRET_KEY;
const saltRounds = 10;

const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.find();
    return res.json(new ApiResponse(200, admin, "All Admin."));
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in getAdmin route.", [
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
    const typeCheck = signupSchema.safeParse(req.body);
    if (!typeCheck.success) {
      return res.json(new ApiError(400, typeCheck.error.issues[0].message));
    }
    const { email, username, password } = typeCheck.data;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      const hashPassword = await bcrypt.hash(password, saltRounds);
      const data = await new Admin({
        email,
        username,
        password: hashPassword,
      }).save();
      return res.json(new ApiResponse(200, data, "Admin Signup Successful."));
    }
    return res.json(new ApiError(400, "Admin Already Exist."));
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in signupAdmin route.", [
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
    const typeCheck = signinSchema.safeParse(req.body);
    if (!typeCheck.success) {
      return res.json(new ApiError(400, typeCheck.error.issues[0].message));
    }
    const { usernameOrEmail, password } = typeCheck.data; // Updated variable name
    const admin = await Admin.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.json(new ApiError(400, "Invalid Credentials."));
    }
    const token = jwt.sign({ usernameOrEmail, role: "admin" }, secretKey, {
      expiresIn: "1h",
    });
    return res.json(new ApiResponse(200, token, "Admin Signin Successful."));
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in signinAdmin route.", [
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
          new ApiResponse(200, admin, "Password Updated Succesfully.")
        );
      }
      return res.json(
        new ApiError(400, "New Password and Confirm Password Is Not Matching.")
      );
    }
    return res.json(new ApiError(400, "Wrong Password."));
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in updateAdmin route.", [
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
      return res.json(new ApiResponse(200, admin, "Admin Deleted."));
    }
    return res.json(new ApiError(400, "Admin Not Present."));
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in deleteAdmin route.", [
        {
          message: err.message,
          stack: err.stack,
        },
      ])
    );
  }
};

const allStudents = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.adminId).populate("students");
    if (!admin) {
      return res.json(new ApiError(404, "Admin Not Found."));
    }
    const students = admin.students;
    return res.json(new ApiResponse(200, students, "My Students."));
  } catch (err) {
    return res.json(
      new ApiError(404, "Code error in allStudents route.", [
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
  allStudents,
};
