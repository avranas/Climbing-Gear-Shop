require('dotenv').config();

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("You need to be logged in to do that.");
  }
}

const checkNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("You need to be logged out do that.");
  }
}

const checkAuthenticatedAsAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userEmail === process.env.ADMIN_NAME) {
    next();
  } else {
    res.status(401).send("You need to be logged in as an admin to do that.");
  }
}

module.exports = { checkAuthenticated, checkNotAuthenticated, checkAuthenticatedAsAdmin };