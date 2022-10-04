const express = require('express');
const orderRouter = express.Router();
const createError = require('http-errors');
const { checkIfLoggedIn, checkIfLoggedInAsAdmin } = require('../authentication-check');
const Order = require('../models/orders');
const OrderItem = require('../models/orderItems');

//Get all of a user's orders
orderRouter.get('/', checkIfLoggedIn, async (req, res, next) => {
  try {
    const dbResp = await Order.findAll({
      where: { userId: req.user.id }
    });
    res.status(200).send(dbResp);
  } catch (err) {
    next(err);
  }
});

//Get an order and its order items by ID.
//The order must belong to the logged in user
orderRouter.get('/:id', checkIfLoggedIn, async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const dbResponse = await Order.findOne({
      where: {
        id: orderId,
        userId: req.user.id
      },
      include: [{
        model: OrderItem,
        required: true
       }]
    });
    res.status(200).send(dbResponse);
  } catch (err) {
    next(err);
  }  
});


/*
Update status of order
{
  newStatus: "Shipped", "Complete", "On backorder", "Cancelled",
    "Returning", "Returning-Shipped", "Returned" are all valid options
}
*/
orderRouter.put('/:id', checkIfLoggedIn, async (req, res, next) => {
  try {
    const newStatus = req.body.newStatus;
    if (newStatus !== "Shipped" &&
      newStatus !== "Complete" && 
      newStatus !== "Cancelled" &&
      newStatus !== "On backorder" &&
      newStatus !== "Cancelled" &&
      newStatus !== "Returning" &&
      newStatus !== "Returning-Shipped" &&
      newStatus !== "Returned"
    ) {
      throw createError(400, 'Invalid entry for newStatus');
    } else {
      await Order.update({
        orderStatus: newStatus
      }, {
        where: { id: req.params.id }
      });
      res.status(200).send(`Updated order status to ${newStatus}`);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

//Delete order and all of its OrderItems
orderRouter.delete('/:id', checkIfLoggedInAsAdmin, async (req, res, next) => {
  try {
    const idToDelete = req.params.id;
    await OrderItem.destroy({
      where: { orderId: idToDelete }
    });
    await Order.destroy({
      where: { id: idToDelete }
    });
    res.status(200).send(`Deleted order#${idToDelete}`)
  }
  catch (err) {
    next(err);
  }
});

module.exports = orderRouter;
