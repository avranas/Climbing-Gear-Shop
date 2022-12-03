const express = require('express');
const { checkNotAuthenticated } = require('./authentication-check');
const loginRouter = express.Router();
const passport = require('../passport-config');

loginRouter.post('/',
  checkNotAuthenticated,
  passport.authenticate('local', {failWithError: true}),
  (req, res, next) => {
    res.status(200).send(`You are logged in as ${req.user.userEmail}`)
  }
);

module.exports = loginRouter;