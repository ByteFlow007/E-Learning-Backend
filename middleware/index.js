
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret_key =process.env.secret_key ;

const userAuth = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next(); // User is authenticated
  } else {
    return res.sendStatus(403); // Forbidden for non-users
  }
};

const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Admin is authenticated
  } else {
    return res.sendStatus(403); // Forbidden for non-admins
  }
};

const auth = (req, res, next) => {
  const jwtKey = req.headers.authorization;
  if (jwtKey) {
    const token = jwtKey;
    jwt.verify(token, secret_key, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Unauthorized
      }
      req.user = user;
      next();
    });
  } else {
    return res.sendStatus(401); // Forbidden
  }
};

module.exports = { adminAuth, userAuth, auth };
