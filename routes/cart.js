const express = require('express');
const CartItem = require('../models/cartItems');
const cartRouter = express.Router();
var createError = require('http-errors');
const { checkIfLoggedIn } = require('../authentication-check');
const Product = require('../models/products');

const getUserCartData = async (userId, next) => {
  try {
    const foundCart = await CartItem.findAll({
      where: { userId: userId }
    });
    return foundCart;
  } catch (err) {
    console.log(err);
    next(err);
  }
}

//Get user's shopping cart
cartRouter.get('/', checkIfLoggedIn, async (req, res, next) => {
  try {
    const cartData = await getUserCartData(req.user.id, next);
    res.status(200).send(cartData);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

/*
  Add item to cart
  {
    quantity:
    productId:
  }
*/
cartRouter.put('/', checkIfLoggedIn, async (req, res, next) => {
  try {
    const body = req.body;
    //Quantity can only be in a range from 1 to 99
    if (body.quantity < 1 || body.quantity > 99) {
      throw createError(400, "quantity is out of range");
    }
    //Check if the product actually exists
    const product = await Product.findOne({
      where: {
        id: body.productId
      }
    });
    if (!product) {
      throw createError(400, "A product with this ID does not exist");
    }
    let newCartItem = null;
    //If the item already exists in the user's cart, I should update the quantity
    const cartData = await getUserCartData(req.user.id, next);
    const foundProduct = cartData.find( i => i.productId === body.productId);
    if (foundProduct) {
      newCartItem = await CartItem.update({
        quantity: body.quantity
        }, { where: {
            productId: body.productId,
            userId: req.user.id
          }
      }, {
        returning: true
      });
    } else {
      //Add the new product to the cart
      newCartItem = await CartItem.create({
        quantity: body.quantity,
        productId: body.productId,
        userId: req.user.id
      }, {
        returning: true
      });
    }
    console.log(newCartItem)
    res.status(200).send(`Updated cart to have ${body.quantity} items with product ID: ${body.productId}`);
  } catch (err) {
    next(err);
  }
});

module.exports = cartRouter;
