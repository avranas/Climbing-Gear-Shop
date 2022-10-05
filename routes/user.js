const express = require('express');
const User = require('../models/users');
const userRouter = express.Router();
const createHttpError = require('http-errors');
const { checkIfLoggedIn, checkIfLoggedInAsAdmin } = require('../authentication-check');
const CartItem = require('../models/cartItems');
const Order = require('../models/orders');

const getUserData = async (username, next) => {
  try {
    const foundUser = await User.findOne({
      where: { username: username }
    });
    if (!foundUser) {
      throw createHttpError(400, "No user with that name was found");
    }
    //Copy the json data of the db response then hide the password
    let copy = JSON.parse(JSON.stringify(foundUser));
    delete copy['password'];
    return copy;
  } catch (err) {
    next(err);
    return null;
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
    if (userData) {
      res.status(200).send(userData);
    }
  } catch (err) {
    next(err);
  }
});

/*
  An admin can compensate a user with more rewards points
  {
    "pointsToAdd": 10
  }
*/
userRouter.put('/rewards-points/:username', checkIfLoggedInAsAdmin, async (req, res, next) => {
  try {
    const username = req.params.username;
    const pointsToAdd = req.body.pointsToAdd;
    const dbResponse = await User.findOne({
      where: { username: username }
    });
    if (!dbResponse) {
      throw createHttpError(404, 'No user with that name exists');
    }
    const currentPoints = dbResponse.rewardsPoints;
    const newBalance = currentPoints + pointsToAdd;
    if (pointsToAdd && typeof pointsToAdd === "number") {
      await User.update({
        rewardsPoints: newBalance
      }, { where: { username: username },
      returning: true
      });
      res.status(200).send(`User: ${username}'s new rewards points balance: ${newBalance}`);
    } else {
      res.status(400).send(`Missing "pointsToAdd" in body`)
    }
  } catch (err) {
    next(err);
  }
});

/*
  An admin can compensate a user with more rewards points
  {
    "newFirstName": "Alex",
    "newLastName": "Vranas",
    "newAddress": "24 Willie Mays Plaza, San Francisco, CA 94107"
  }
*/
//Update logged in user's first name, last name, address
userRouter.put('/', checkIfLoggedIn, async (req, res, next) => {
  try {
    const body = req.body;
    const user = req.user;
    const newFirstName = body.newFirstName;
    const newLastName = body.newLastName;
    const newAddress = body.newAddress;
    let dbResponse = null;
    if (newFirstName) {
      dbResponse = await User.update({
          firstName: newFirstName
        }, { where: { username: user.username },
        returning: true
      });
    }
    if (newLastName) {
      dbResponse = await User.update({
        lastName: newLastName
      }, { where: { username: user.username },
      returning: true
    });
    }
    if (newAddress) {
      dbResponse = await User.update({
        address: newAddress
      }, { where: { username: user.username },
      returning: true
    });
    }
    if (dbResponse === null) {
      res.status(200).send('Nothing was updated');
    }
    const dbObject = dbResponse[1][0];
    const returnThis = {
      firstName: dbObject.firstName,
      lastName: dbObject.lastName,
      address: dbObject.address,
    }
    res.status(200).send(returnThis);
  } catch (err) {
    next(err);
  }
});

const deleteUser = async (userId, next) => {
  try {
    //Delete the user's cart items
     await CartItem.destroy({
       where: { userId: userId }
     });
    //Delete the user's orders
     await Order.destroy({
      where: { userId: userId }
    });
    await User.destroy({
      where: { id: userId }
    });
  } catch (err) {
    next(err);
  }
}

//TODO NEXT: fix this this needs to delete all of the things
//Delete own user account if logged in
userRouter.delete('/', checkIfLoggedIn, async (req, res, next) => {
  try {
    await deleteUser(req.user.id, next);
    res.status(200).send('Your account has been deleted');
  } catch (err) {
    next(err);
  }
});

//Delete another user account by id if logged in as admin
//This deletes all of the user's cart items and orders, so
//this should never be used on a customer who has a pending order
userRouter.delete('/:username', checkIfLoggedInAsAdmin, async (req, res, next) => {
  try {
    //Check if a user actually exists
    const usernameToDelete = req.params.username;
    const userToDelete = await User.findOne({
      where: { username: usernameToDelete }
    });
    if (!userToDelete) { 
      throw createHttpError(404, 'No user with that name was found');
    }
    await deleteUser(userToDelete.id, next);
    res.status(200).send(`User with username ${usernameToDelete} has been deleted`);
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
