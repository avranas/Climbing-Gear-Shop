const express = require("express");
const CartItem = require("../models/cartItems");
const cartRouter = express.Router();
var createHttpError = require("http-errors");
const {
  checkAuthenticated, 
} = require("./authentication-check");
const Product = require("../models/products");
const ProductOption = require("../models/productOptions");
const getUserCartData = require("./getUserCartData");


const performChecks = async (body) => {
  //quantity, productId and optionSelection are required
  if (body.productId === undefined) {
    throw createHttpError(400, 'Body needs a "productId"');
  }
  if (body.quantity === undefined) {
    throw createHttpError(400, 'Body needs a "quantity"');
  }
  if (body.optionSelection === undefined) {
    throw createHttpError(400, 'Body needs an "optionSelection"');
  }
  //Quantity can only be in a range from 1 to 99
  if (body.quantity < 0 || body.quantity > 99) {
    throw createHttpError(
      400,
      "Quantity is out of range. It must be between 0 and 99"
    );
  }
  //Check if the product actually exists
  const product = await Product.findOne({
    where: {
      id: body.productId,
    },
    include: [
      {
        where: {option: body.optionSelection},
        attributes: ["amountInStock"],
        model: ProductOption, as: "productOptions"
      },
    ],
  });
  if (!product) {
    throw createHttpError(404, "A product with this ID does not exist");
  }
}

//Get current user's shopping cart
cartRouter.get("/", checkAuthenticated, async (req, res, next) => {
  try {
    const cartData = await getUserCartData(req.user.id);
    if (cartData.length === 0) {
      res.status(200).send([]);
    } else {
      res.status(200).send(cartData);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

//Create new item in cart
//If there is a matching item, add new quantity to existing item
/*
  {
    quantity:
    productId:
    optionSelection:
  }
*/
cartRouter.post('/', checkAuthenticated, async (req, res, next) => {
  try {
    const body = req.body;
    const userId = req.user.id;
    performChecks(body);
    const cartData = await getUserCartData(userId);
    const foundProduct = cartData.find(
      (i) =>
        i.productId === Number(body.productId) &&
        i.optionSelection === body.optionSelection
    );
    //If the same item exists in the user's cart, I should add to the quantity
    let tooManyProductsRequested = false;
    let newCartItem = null;
    if (foundProduct) {
      let newQuantity =  Number(body.quantity) + foundProduct.quantity;
      const amountInStock = cartData[0].product.productOptions[0].amountInStock;
      if (Number(newQuantity) > amountInStock) {
        tooManyProductsRequested = true;
        newQuantity = amountInStock;
      }
      newCartItem = await CartItem.update(
        {
          quantity: newQuantity
        },
        {
          where: {
            productId: body.productId,
            optionSelection: body.optionSelection,
            userId: userId,
          },
        },
        {
          returning: true,
        }
      );
    } else {
      //Add the new product to the cart
      newCartItem = await CartItem.create(
        {
          quantity: body.quantity,
          productId: body.productId,
          optionSelection: body.optionSelection,
          userId: userId,
        },
        {
          returning: true,
        }
      );
    }
    if (tooManyProductsRequested) {
      res
        .status(200)
        .send("Not enough in stock. Setting to the max.");
    }
    res
      .status(200)
      .send(newCartItem);
  } catch (err) {
    next(err);
  }
})

//Modify existing item in cart. 
//Sets new quantity
/*
  {
    quantity:
    productId:
    optionSelection:
  }
*/
cartRouter.put("/", checkAuthenticated, async (req, res, next) => {
  try {
    const body = req.body;
    const userId = req.user.id;
    performChecks(body);

    //If quantity === 0, remove from the cart
    if (body.quantity === 0) {
      await CartItem.destroy({
        where: {
          userId: userId,
          productId: body.productId,
          optionSelection: body.optionSelection
        },
      });
      res
        .status(200)
        .send(
          `Removed product with ID#${body.productId} from your shopping cart`
        );
      return;
    }
    const cartData = await getUserCartData(userId);
    const foundProduct = cartData.find(
      (i) =>
        i.productId === Number(body.productId) &&
        i.optionSelection === body.optionSelection
    );
    let newCartItem = null;
    //If you found the item in the user's cart, update its quantity
    if (foundProduct) {
      await CartItem.update(
        {
          quantity: body.quantity
        },
        {
          where: {
            productId: body.productId,
            optionSelection: body.optionSelection,
            userId: userId,
          },
        },
        {
          returning: true,
        }
      );
    } else {
      throw createHttpError(404, "Unable to find matching product/product option");
    }
    res
      .status(200)
      .send(newCartItem);
  } catch (err) {
    next(err);
  }
});

//Remove all items from the shopping cart
cartRouter.delete("/", checkAuthenticated, async (req, res, next) => {
  try {
    await CartItem.destroy({
      where: { userId: req.user.id },
    });
    res.status(200).send(`Removed all items from your shopping cart`);
  } catch (err) {
    next(err);
  }
});

//Remove one item from the shopping cart
cartRouter.delete("/:id", checkAuthenticated, async (req, res, next) => {
  try {
    const id = req.params.id;
    const itemToDelete = await CartItem.findOne({
      where: { id: id },
    });
    if (!itemToDelete) {
      throw createHttpError(404, "No cart item with that ID was found");
    }
    await CartItem.destroy({
      where: { id: id },
    });
    res.status(200).send(`Removed cart item with id#${id}`);
  } catch (err) {
    next(err);
  }
});

module.exports = cartRouter;
