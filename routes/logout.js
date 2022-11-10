const express = require('express');
const logoutRouter = express.Router();
const { checkAuthenticated } = require('./authentication-check');

logoutRouter.get('/', checkAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
      else
    res.status(200).send('You are now logged out')
  });
});

module.exports = logoutRouter;
