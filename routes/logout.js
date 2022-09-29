const express = require('express');
const logoutRouter = express.Router();
const { checkIfLoggedIn } = require('../authentication-check');

logoutRouter.get('/', checkIfLoggedIn, (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
      else
    res.status(200).send('You are now logged out')
  });
});

module.exports = logoutRouter;
