const express = require('express');
const User = require('../models/users');
const userRouter = express.Router();
const createError = require('http-errors');
const { checkIfLoggedIn, checkIfLoggedInAsAdmin } = require('../authentication-check');

const getUserData = async (username, next) => {
  try {
    const foundUser = await User.findOne({
      where: { username: username }
    });
    if (!foundUser) {
      throw createError(400, "No user with that name was found");
    }
    //Copy the json data of the db response then hide the password
    let copy = JSON.parse(JSON.stringify(foundUser));
    delete copy['password'];
    return copy;
  } catch (err) {
    console.log(err);
    next(err);
  }
}

//Get logged in user's data
userRouter.get('/', checkIfLoggedIn, async (req, res, next) => {
  try {
    const userData = await getUserData(req.user.username, next);
    res.status(200).send(userData);
  } catch (err) {
    next(err);
  }
});

//Get user by username
userRouter.get('/:username', checkIfLoggedInAsAdmin, async (req, res, next) => {
  try {
    const userData = await getUserData(req.params.username, next);
    res.status(200).send(userData);
  } catch (err) {
    next(err);
  }
});

//Update logged in user's first name, last name, address, and/or rewards points
userRouter.put('/', checkIfLoggedIn, async (req, res, next) => {
  try {
    const body = req.body;
    const user = req.user;
    const newFirstName = body.newFirstName;
    const newLastName = body.newLastName;
    const newAddress = body.newAddress;
    const newRewardsPoints = body.newRewardsPoints;
    let dbResponse = null;
    if (newFirstName) {
      dbResponse = await User.update({
          firstName: newFirstName
        }, { where: { username: user.username },
        returning: true
      });
      updatedUserData.firstName = newFirstName;
    }
    if (newLastName) {
      dbResponse = await User.update({
        lastName: newLastName
      }, { where: { username: user.username },
      returning: true
    });
      updatedUserData.lastName = newLastName;
    }
    if (newAddress) {
      dbResponse = await User.update({
        address: newAddress
      }, { where: { username: user.username },
      returning: true
    });
      updatedUserData.address = newAddress;
    }
    if (newRewardsPoints && typeof newRewardsPoints === "number") {
      dbResponse = await User.update({
        rewardsPoints: newRewardsPoints
      }, { where: { username: user.username },
      returning: true
    });
      updatedUserData.rewardsPoints = newRewardsPoints;
    }
    if (dbResponse === null) {
      res.status(200).send('Nothing was updated');
    }
    const dbObject = dbResponse[1][0];
    const returnThis = {
      firstName: dbObject.firstName,
      lastName: dbObject.lastName,
      address: dbObject.address,
      rewardsPoints: dbObject.rewardsPoints,
    }
    res.status(200).send(returnThis);
  } catch (err) {
    next(err);
  }
});

//Delete own user account if logged in
userRouter.delete('/', checkIfLoggedIn, async (req, res, next) => {
  try {
    await User.destroy({
      where: { username: req.user.username }
    })
    res.status(200).send('Your account has been deleted');
  } catch (err) {
    next(err);
  }
});

//Delete another user account by id if logged in as admin
userRouter.delete('/:username', checkIfLoggedInAsAdmin, async (req, res, next) => {
  try {
    const userToDelete = req.params.username;
    await User.destroy({
      where: { username: userToDelete }
    })
    //TODO: Come back after finishing carts and delete the user's cart and cart items
    res.status(200).send(`User with username ${userToDelete} has been deleted`);
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
