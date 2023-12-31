const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;
const ApiError = require("../utils/ApiError.js");

const userAuth = (req, res, next) => {
  if (req.user && req.user.role === "user") {
    next(); // User is authenticated
  } else {
    return res.json(new ApiError(403, "Invalid User.")); // Forbidden for non-users
  }
};

const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Admin is authenticated
  } else {
    return res.json(new ApiError(403, "Invalid Admin.")); // Forbidden for non-users
  }
};

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.json(new ApiError(401, "Invalid Token.")); // Forbidden for non-users
  }
  jwt.verify(token, secret_key, (err, user) => {
    if (err) {
      return res.json(new ApiError(403, "Error occured in Verification.")); // Unauthorized
    }
    req.user = user;
    next();
  });
};

module.exports = { adminAuth, userAuth, auth };
