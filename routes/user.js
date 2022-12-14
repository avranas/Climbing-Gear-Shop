const express = require("express");
const User = require("../models/users");
const userRouter = express.Router();
const createHttpError = require("http-errors");
const {
  checkAuthenticated,
  checkAuthenticatedAsAdmin,
} = require("./authentication-check");
const CartItem = require("../models/cartItems");
const Order = require("../models/orders");
const OrderItem = require("../models/orderItems");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const getUserData = async (userEmail, next) => {
  try {
    const foundUser = await User.findOne({
      where: { userEmail: userEmail },
    });
    if (!foundUser) {
      throw createHttpError(400, "No user with that name was found");
    }
    //Copy the json data of the db response then hide the password
    let copy = JSON.parse(JSON.stringify(foundUser));
    delete copy["password"];
    return copy;
  } catch (err) {
    next(err);
    return null;
  }
};

//Get logged in user's data
userRouter.get("/", checkAuthenticated, async (req, res, next) => {
  try {
    const userData = await getUserData(req.user.userEmail, next);
    res.status(200).send(userData);
  } catch (err) {
    next(err);
  }
});

//Get user by userEmail
userRouter.get(
  "/:userEmail",
  checkAuthenticatedAsAdmin,
  async (req, res, next) => {
    try {
      const userData = await getUserData(req.params.userEmail, next);
      if (userData) {
        res.status(200).send(userData);
      }
    } catch (err) {
      next(err);
    }
  }
);

/*
  An admin can compensate a user with more rewards points
  {
    "pointsToAdd": 10
  }
*/
userRouter.put(
  "/rewards-points/:userEmail",
  checkAuthenticatedAsAdmin,
  async (req, res, next) => {
    try {
      const userEmail = req.params.userEmail;
      const pointsToAdd = req.body.pointsToAdd;
      const dbResponse = await User.findOne({
        where: { userEmail: userEmail },
      });
      if (!dbResponse) {
        throw createHttpError(404, "No user with that name exists");
      }
      const currentPoints = dbResponse.rewardsPoints;
      const newBalance = currentPoints + pointsToAdd;
      if (pointsToAdd && typeof pointsToAdd === "number") {
        await User.update(
          {
            rewardsPoints: newBalance,
          },
          { where: { userEmail: userEmail }, returning: true }
        );
        res
          .status(200)
          .send(
            `User: ${userEmail}'s new rewards points balance: ${newBalance}`
          );
      } else {
        res.status(400).send(`Missing "pointsToAdd" in body`);
      }
    } catch (err) {
      next(err);
    }
  }
);

userRouter.put(
  "/expire-stripe-session",
  checkAuthenticated,
  async (req, res, next) => {
    try {
      const response = await User.findOne({
        attributes: ["checkoutSessionId"],
        where: { id: req.user.id },
      });
      if (!response.checkoutSessionId) {
        res.status(200).send("No session found");
        return;
      }
      const session = await stripe.checkout.sessions.retrieve(
        response.checkoutSessionId
      );
      if (session.status === "open") {
        await stripe.checkout.sessions.expire(response.checkoutSessionId);
        await User.update(
          {
            checkoutSessionId: null,
          },
          {
            where: { id: req.user.id },
          }
        );
      }
      res.status(200).send("Session expired");
    } catch (err) {
      next(err);
    }
  }
);

/*
  Update logged in user's first name, last name, home address
  {
    "newName": "Alex Vranas",
    "newHomeAddress": "24 Willie Mays Plaza, San Francisco, CA 94107"
  }
*/
userRouter.put("/", checkAuthenticated, async (req, res, next) => {
  try {
    const body = req.body;
    const user = req.user;
    const newName = body.newName;
    const newHomeAddress = body.newHomeAddress;
    let dbResponse = null;
    if (newName) {
      dbResponse = await User.update(
        {
          name: newName,
        },
        { where: { userEmail: user.userEmail }, returning: true }
      );
    }
    if (newHomeAddress) {
      dbResponse = await User.update(
        {
          homeAddress: newHomeAddress,
        },
        { where: { userEmail: user.userEmail }, returning: true }
      );
    }
    if (dbResponse === null) {
      res.status(200).send("Nothing was updated");
    }
    const dbObject = dbResponse[1][0];
    const returnThis = {
      name: dbObject.name,
      homeAddress: dbObject.homeAddress,
    };
    res.status(200).send(returnThis);
  } catch (err) {
    next(err);
  }
});

const deleteUser = async (userId) => {
  //Delete the user's cart items
  await CartItem.destroy({
    where: { userId: userId },
  });

  const orders = await Order.findAll({
    where: { userId: userId },
  });
  await Promise.all(
    orders.map(async (i) => {
      OrderItem.destroy({
        where: { orderId: i.id },
      });
    })
  );
  await Order.destroy({
    where: { userId: userId },
  });
  await User.destroy({
    where: { id: userId },
  });
};

//Delete own user account if logged in
userRouter.delete("/", checkAuthenticated, async (req, res, next) => {
  try {
    await deleteUser(req.user.id);
    res.status(200).send("Your account has been deleted");
  } catch (err) {
    next(err);
  }
});

/*
  Delete another user account by id if logged in as admin
  This deletes all of the user's cart items and orders, so
  this should never be used on a customer who has a pending order
*/
userRouter.delete("/:id", checkAuthenticatedAsAdmin, async (req, res, next) => {
  try {
    //Check if a user actually exists
    const userIdToDelete = req.params.id;
    const userToDelete = await User.findOne({
      where: { id: userIdToDelete },
    });
    if (!userToDelete) {
      throw createHttpError(404, "No user with that id was found");
    }
    await deleteUser(userToDelete.id);
    res.status(200).send(`User with id ${userIdToDelete} has been deleted`);
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
