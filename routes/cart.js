const express = require('express');
const CartItem = require('../models/cartItems');
const cartRouter = express.Router();
var createHttpError = require('http-errors');
const { checkAuthenticated, checkAuthenticatedAsAdmin } = require('./authentication-check');
const Product = require('../models/products');
const ProductOption = require('../models/productOptions');

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
cartRouter.get('/', checkAuthenticated, async (req, res, next) => {
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
  {
    quantity:
    productId:
    optionSelection:
  }
*/
cartRouter.put('/', checkAuthenticated, async (req, res, next) => {
  try {
    const body = req.body;
    const userId = req.user.id;
    //quantity, productId and optionSelection are required
    if (body.productId === undefined) {
      throw createError(400, 'Body needs a "productId"');
    }
    if (body.quantity === undefined) {
      throw createError(400, 'Body needs a "quantity"');
    }
    if (body.optionSelection === undefined) {
      throw createError(400, 'Body needs an "optionSelection"');
    }
    //If quantity === 0, remove from the cart
    if (body.quantity === 0) {
      await CartItem.destroy({
        where: {
          userId: userId,
          productId: body.productId,
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
    //If the item already exists in the user's cart and it's the same option, I should update the quantity
    const cartData = await getUserCartData(userId, next);
    const foundProduct = cartData.find(i =>
      i.productId === Number(body.productId) && 
      i.optionSelection === body.optionSelection
    );
    if (foundProduct) {
      newCartItem = await CartItem.update({
        quantity: body.quantity
        }, { 
          where: {
            productId: body.productId,
            optionSelection: body.optionSelection,
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
        optionSelection: body.optionSelection,
        userId: userId
      }, {
        returning: true
      });
    }
    res.status(200).send(`Updated cart to have ${body.quantity} items with product ID: ${body.productId} With optionSelection: ${body.optionSelection}`);
  } catch (err) {
    next(err);
  }
});

/*Takes an array of cart items, and adds them to the cart
A cart item:
{
  quantity:
  productId:
  optionSelection:
}
*/
cartRouter.put('/convert-guest-cart', async (req, res, next) => {
  try {
    const body = req.body;
    const user = req.user;
    const newCartItems = []
    //Get the current cart for use later
    const currentCart = await CartItem.findAll({
      where: { userId: user.id },
    });
    const cartItemsToDestroy = [];
    body.forEach(i => {
      //quantity, productId and optionSelection are required
      if (i.productId === undefined) {
        throw createError(400, 'An element is missing its "productId"');
      }
      if (i.quantity === undefined) {
        throw createError(400, 'An element is missing its "quantity"');
      }
      if (i.optionSelection === undefined) {
        throw createError(400, 'An element is missing its "optionSelection"');
      }
      //Quantity can only be in a range from 1 to 99
      if (i.quantity < 1 || i.quantity > 99) {
        throw createError(400, "Quantity is out of range. It must be between 1 and 99");
      }
      //If the item is already in the user's cart, delete it, so it can be replaced
      //by the new one with an updated quantity
      const foundItem = currentCart.find(j =>
        Number(i.productId) === j.productId &&
        i.optionSelection === j.optionSelection
      );
      newCartItems.push({
        quantity: i.quantity,
        optionSelection: i.optionSelection,
        productId: i.productId,
        userId: user.id
      })
      if (foundItem) {
        cartItemsToDestroy.push(foundItem.id);
      }
    });
    await CartItem.destroy({
      where: { id: cartItemsToDestroy }
    });
    //Add the new product to the cart
    const response = await CartItem.bulkCreate(
      newCartItems
    , {
      returning: true
    });
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
});

//Remove all items from the shopping cart
cartRouter.delete('/', checkAuthenticated, async (req, res, next) => { 
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
cartRouter.delete('/:id', checkAuthenticated, async (req, res, next) => { 
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
