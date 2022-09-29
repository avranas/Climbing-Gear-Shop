const express = require('express');
const productRouter = express.Router();
var createError = require('http-errors');
const Product = require('../models/products');
const { checkIfLoggedInAsAdmin } = require('../authentication-check');

//Get all products
productRouter.get('/', async (req, res, next) => {
  try {
    const dbResp = await Product.findAll();
    res.status(200).send(dbResp);
  } catch (err) {
    next(err);
  }
});

//Get one product by id
productRouter.get('/:id', async (req, res, next) => {
  try {
    const dbResp = await Product.findOne({
      where: { id: req.params.id }
    });
    res.status(200).send(dbResp);
  } catch (err) {
    next(err);
  }
});

/*
  //POST new product
  {
    "productName": "Sama Harness - Men's Medium",
    "description": " Soft, breathable mesh fabric lines the harness for better comfort on the skin and hot days on the wall",
    "price": 74.95,
    "categoryName": "harnesses",
    "brandName": "Petzl",
    "amountInStock": 5
  }
*/
productRouter.post('/', checkIfLoggedInAsAdmin, async (req, res, next) => {
  try {
    const body = req.body;
    const newProduct = await Product.create({
      productName: body.productName,
      description: body.description,
      price: body.price,
      categoryName: body.categoryName,
      brandName: body.brandName,
      amountInStock: body.amountInStock
    });
    res.status(200).send(newProduct);
  } catch (err) {
    next(err);
  }
});

/*
  Update any combination of productName, description, price,
    categoryName, brandName, or amountInStock
  {
    "productName": "Sama Harness - Men's Large",
    "price": 84.95,
  }
*/
productRouter.put('/:id', checkIfLoggedInAsAdmin, async (req, res, next) => {
  try {
    const body = req.body;
    const productId = req.params.id;
    const newProductName = body.productName;
    const newDescription = body.description;
    const newPrice = body.price;
    const newCategoryName = body.categoryName;
    const newBrandName = body.brandName;
    const newAmountInStock = body.amountInStock;
    let dbResponse = null;
    if (newProductName) {
      dbResponse = await Product.update({
        productName: newProductName
        }, { where: { id: productId },
        returning: true
      });
    }
    if (newDescription) {
      dbResponse = await Product.update({
        description: newDescription
        }, { where: { id: productId },
        returning: true
      });
    }
    console.log(typeof newPrice);
    if (newPrice && typeof newPrice === "number") {
      dbResponse = await Product.update({
        price: newPrice
        }, { where: { id: productId },
        returning: true
      });
    }
    if (newCategoryName) {
      dbResponse = await Product.update({
        categoryName: newCategoryName
        }, { where: { id: productId },
        returning: true
      });
    }
    if (newBrandName) {
      dbResponse = await Product.update({
        brandName: newBrandName
        }, { where: { id: productId },
        returning: true
      });
    }
    if (newAmountInStock && Number.isInteger(newAmountInStock)) {
      dbResponse = await Product.update({
        amountInStock: newAmountInStock
        }, { where: { id: productId },
        returning: true
      });
    }
    if (dbResponse === null) {
      res.status(200).send('Nothing was updated');
      return;
    }
    res.status(200).send(dbResponse[1][0]);
  } catch (err) {
    next(err);
  }
});

productRouter.delete('/:id', checkIfLoggedInAsAdmin, async (req, res, next) => {
  try {
    const idToDelete = req.params.id;
    await Product.destroy({
      where: {
        id: idToDelete
      }
    });
    res.status(200).send(`Deleted product with id: ${idToDelete}`)
  } catch(err){
    console.log(err);
    next(err);
  }
});

module.exports = productRouter;
