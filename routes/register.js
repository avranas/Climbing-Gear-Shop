const express = require("express");
const registerRouter = express.Router();
const createHttpError = require("http-errors");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const { checkNotAuthenticated } = require("./authentication-check");

registerRouter.post("/", checkNotAuthenticated, async (req, res, next) => {
  try {
    const body = req.body;
    const newUserEmail = body.userEmail;
    const newName = body.name;
    const newPassword = body.password;
    if (!newUserEmail) {
      throw createHttpError(
        400,
        '"userEmail" is missing from the request body'
      );
    } else if (!newName) {
      throw createHttpError(400, '"name" is missing from the request body');
    } else if (!newPassword) {
      throw createHttpError(400, '"password" is missing from the request body');
    }
    //Check if that userEmail already exists
    const dbResponse = await User.findOne({
      where: { userEmail: newUserEmail },
    });
    //dbResponse will be null if nothing is returned from the database
    if (dbResponse != null) {
      throw createHttpError(400, "A user with that email already exists");
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
          name: newName,
          rewardsPoints: 0,
        });
      });
    });

    res.status(200).send(`Account created: ${newUserEmail}`);
  } catch (err) {
    next(err);
  }
});

module.exports = registerRouter;
