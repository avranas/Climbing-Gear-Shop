const express = require('express');
const orderRouter = express.Router();
var createError = require('http-errors');
const { checkIfLoggedIn, checkIfLoggedInAsAdmin } = require('../authentication-check');
const Order = require('../models/orders');

//Get all of a user's orders
orderRouter.get('/', checkIfLoggedIn, async (req, res, next) => {
  try {
    const dbResp = await Order.findAll({where: {
      userId: req.user.id
    }});
    res.status(200).send(dbResp);
  } catch (err) {
    next(err);
  }
});

//Get order by id
orderRouter.get('/:id', checkIfLoggedIn, async (req, res, next) => {
  try {
    const dbResp = await Order.findOne({where: {
      id: req.params.id
    }});
    res.status(200).send(dbResp);
  } catch (err) {
    next(err);
  }  
});

/*
Create new order
{
  
  
}
*/
orderRouter.post('/', checkIfLoggedIn, async (req, res, next) => {
  try {
    //If no items are in the cart, throw error
    const cartData = await CartItem.findAll({
      where: { userId: req.user.id }
    });
    if (!cartData) {
      
    }
    //Else, get all cart items and create a new order
    
  } catch (err) {
    
  }
  
});

//Modify order by :id
orderRouter.put('/:id', checkIfLoggedIn, async (req, res, next) => {
  
});

//Delete order
orderRouter.delete('/', checkIfLoggedInAsAdmin, async (req, res, next) => {
  
});

module.exports = orderRouter;
