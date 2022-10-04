const express = require('express');
const checkoutRouter = express.Router();
const createError = require('http-errors');
const { checkIfLoggedIn, checkIfLoggedInAsAdmin } = require('../authentication-check');
const Order = require('../models/orders');
const CartItem = require('../models/cartItems');
const Product = require('../models/products');
const OrderItem = require('../models/orderItems');

//Grab info from shopping cart, charge customer, create new Order, empty shopping cart
checkoutRouter.post('/', checkIfLoggedIn, async (req, res, next) => {
  try {
    const userId = req.user.id;
    //Read all of the cart items
    const dbResponse = await CartItem.findAll({
      where: { userId: userId },
      include: [{
        model: Product,
        required: true
       }]
    });
    //If there are no cart items, return "cart is empty!"
    if (dbResponse.length === 0) {
      throw createError(400, 'Your cart is empty, so an order can not be placed');
    }
    //Calculate the tax and total here
    let subTotal = 0;
    dbResponse.forEach( i => { 
      subTotal += i.product.price * i.quantity;
    });
    /*
      Uses the sales tax of Hayward, CA. If I were to decide on using this app 
      for a real business, I would need to find a way to calculate sales tax based
      on the user's address
    */
    const salesTaxPercentage = 10.75;
    const taxToAdd = subTotal * salesTaxPercentage / 100;
    const grandTotal = subTotal + taxToAdd; 

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //IMAGINARY PAYMENT HAPPENS HERE
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    //If there was a problem with the payment
    //res.status(200).send('There was a problem with your payment');

    //Create a new Order and get its ID
    const newOrder = await Order.create({
      subTotal: subTotal,
      taxCharged: taxToAdd,
      totalPrice: grandTotal,
      orderStatus: "Placed",
      userId: userId
    }, { 
      returning: true
    });
    const newOrderItems = [];
    //For each item in the cart, create a new OrderItem
    dbResponse.forEach( i => {
      const newOrderItem = {
        price: i.product.price,
        quantity: i.quantity,
        productId: i.product.id,
        orderId: newOrder.id
      };
      newOrderItems.push(newOrderItem);
    })
    console.log(newOrderItems)
    await OrderItem.bulkCreate(newOrderItems);
    //Empty the user's cart after the order has been placed.
    await CartItem.destroy({
      where: { userId: userId }
    });
    res.status(200).send(newOrder);
  } catch (err) {
    next(err);
  }
});

module.exports = checkoutRouter;