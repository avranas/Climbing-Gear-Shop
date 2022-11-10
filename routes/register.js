const express = require('express');
const registerRouter = express.Router();
const createHttpError = require('http-errors');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const { checkNotAuthenticated } = require('./authentication-check');

registerRouter.post('/', checkNotAuthenticated, async (req, res, next) => {
  try {
    const body = req.body;
    const newUserEmail = body.userEmail;
    const newFirstName = body.firstName;
    const newLastName = body.lastName;
    const newPassword = body.password;
    if (!newUserEmail) {
      throw createHttpError(400, '"userEmail" is missing from the request body');
    } else if (!newFirstName) {
      throw createHttpError(400, '"firstName" is missing from the request body');
    } else if (!newLastName) {
      throw createHttpError(400, '"lastName" is missing from the request body');
    } else if (!newPassword) {
      throw createHttpError(400, '"password" is missing from the request body');
    }
    //Check if that userEmail already exists
    const dbResponse = await User.findOne({
      where: { userEmail: newUserEmail }
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
          userEmail: newUserEmail,
          password: hash,
          firstName: newFirstName,
          lastName: newLastName,
          rewardsPoints: 0
        });
      });
    });

    res.status(200).send(`Account created: ${newUserEmail}`)
  } catch (err) {
    next(err)
  }
});

module.exports = registerRouter;