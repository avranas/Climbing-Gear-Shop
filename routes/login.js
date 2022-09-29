const express = require('express');
const { checkIfNotLoggedIn } = require('../authentication-check');
const loginRouter = express.Router();
const passport = require('../passport-config');

loginRouter.post('/',
  checkIfNotLoggedIn,
  passport.authenticate('local', {}),
  (req, res, next) => {
    res.status(200).send(`You are logged in as ${req.user.username}`)
  }
);

module.exports = loginRouter;