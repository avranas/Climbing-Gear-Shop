const express = require('express');
const CartItem = require('../models/cartItems');
const cartRouter = express.Router();
var createHttpError = require('http-errors');
const { checkIfLoggedIn, checkIfLoggedInAsAdmin } = require('../authentication-check');
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

//Get current user's shopping cart
cartRouter.get('/', checkIfLoggedIn, async (req, res, next) => {
  try {
    const cartData = await getUserCartData(req.user.id, next);
    if (cartData.length === 0) {
      res.status(200).send('Your shopping cart is empty');
    } else {
      res.status(200).send(cartData);
    }
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
    const userId = req.user.id;
    //quantity and productId are both required
    if (body.productId === undefined) {
      throw createError(400, 'Body needs a "productId"');
    }
    if (body.quantity === undefined) {
      throw createError(400, 'Body needs a "quantity"');
    }
    //If quantity === 0, remove from the cart
    if (body.quantity === 0) {
      await CartItem.destroy({
        where: {
          userId: userId,
          productId: body.productId
        }
      });
      res.status(200).send(`Removed product with ID#${body.productId} from your shopping cart`);
      return;
    }
    //Quantity can only be in a range from 1 to 99
    if (body.quantity < 1 || body.quantity > 99) {
      throw createError(400, "Quantity is out of range. It must be between 1 and 99");
    }
    //Check if the product actually exists
    const product = await Product.findOne({
      where: {
        id: body.productId
      }
    });
    if (!product) {
      throw createError(404, "A product with this ID does not exist");
    }
    let newCartItem = null;
    //If the item already exists in the user's cart, I should update the quantity
    const cartData = await getUserCartData(userId, next);
    const foundProduct = cartData.find( i => i.productId === body.productId);
    if (foundProduct) {
      newCartItem = await CartItem.update({
        quantity: body.quantity
        }, { 
          where: {
            productId: body.productId,
            userId: userId
          }
      }, {
        returning: true
      });
    } else {
      //Add the new product to the cart
      newCartItem = await CartItem.create({
        quantity: body.quantity,
        productId: body.productId,
        userId: userId
      }, {
        returning: true
      });
    }
    res.status(200).send(`Updated cart to have ${body.quantity} items with product ID: ${body.productId}`);
  } catch (err) {
    next(err);
  }
});

//Remove all items from the shopping cart
cartRouter.delete('/', async (req, res, next) => { 
  try {
    await CartItem.destroy({
      where: { userId: req.user.id }
    });
    res.status(200).send(`Removed all items from your shopping cart`);
  } catch (err) {
    next(err);
  }
});

//Remove one item from the shopping cart
cartRouter.delete('/:id', async (req, res, next) => { 
  try {
    const id = req.params.id;
    const itemToDelete = await CartItem.findOne({
      where: { id: id }
    });
    if (!itemToDelete) { 
      throw createHttpError(404, 'No cart item with that ID was found');
    }
    await CartItem.destroy({
      where: { id: id }
    });
    res.status(200).send(`Removed cart item with id#${id}`);
  } catch (err) {
    next(err);
  }
});

module.exports = cartRouter;
