const express = require('express');
const registerRouter = express.Router();
const createHttpError = require('http-errors');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const { checkIfNotLoggedIn } = require('../authentication-check');

registerRouter.post('/', checkIfNotLoggedIn, async (req, res, next) => {
  try {
    const newUsername = req.body.username;
    const newPassword = req.body.password;
    //Check if that username already exists
    const dbResponse = await User.findOne({
      where: { username: newUsername }
    });
    //dbResponse will be null if nothing is returned from the database
    if (dbResponse != null) {
      throw createHttpError(400, 'A user with that name already exists');
    }
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(newPassword, salt, async (err, hash) => {
        if (err) {
          throw err;
        }
        await User.create({
          username: newUsername,
          password: hash,
          rewardsPoints: 0
        });
      });
    });

    res.status(200).send(`Account created: ${newUsername}`)
  } catch (err) {
    next(err)
  }
});

module.exports = registerRouter;