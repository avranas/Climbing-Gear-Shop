const express = require("express");
const productRouter = express.Router();
const createHttpError = require("http-errors");
const Product = require("../models/products");
const { checkAuthenticatedAsAdmin } = require("./authentication-check");
const OrderItem = require("../models/orderItems");
const ProductOption = require("../models/productOptions");

//Get all products with options
productRouter.get("/", async (req, res, next) => {
  try {
    const dbResp = await Product.findAll({
      include: [{
        model: ProductOption,
        required: true
      }]
    });
    console.log(dbResp);
    res.status(200).send(dbResp);
  } catch (err) {
    next(err);
  }
});

//Get one product and its options by id
productRouter.get("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({
      where: { id: productId },
    });
    if (product === null) {
      throw createHttpError(404, `Product with id#${productId} not found`);
    }
    const productOptions = await ProductOption.findAll({
      where: { productId: productId },
    });
    if (productOptions === null) {
      throw createHttpError(404, `Product is missing options`);
    }
    const sendThis = {
      product: product,
      productOptions: productOptions,
    };
    res.status(200).send(sendThis);
  } catch (err) {
    next(err);
  }
});

/*
Create a new productOption fora product with the productOptionID, option, amountInStock, and price
{
  "option": "Small",
  "amountInStock": 2,
  "price": 64.95
}
*/
productRouter.post("/option/:id", checkAuthenticatedAsAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body;
    //Check to make sure productOptionID exist
    const response = await Product.findOne({
      where: { id: id}
    });
    if (response === null) {
      throw createHttpError(404, `Product with id#${id} not found`);
    }
    //Check to make sure all required entries exist
    if (
      body.option === undefined ||
      body.amountInStock === undefined ||
      body.price === undefined
    ) {
      throw createHttpError(
        400,
        "Missing item in the body. Needs an option, amountInStock, and price"
      );
    }
    const newProductOption = await ProductOption.create({
      productId: id,
      option: body.option,
      price: body.price,
      amountInStock: body.amountInStock
    });
    res.status(200).send(newProductOption);
  } catch (err) {
    next(err);
  }
});
/*
  //POST new product
  {
      "productName": "VR9 9.8 mm Dry-Core Rope",
      "description": "Just getting into the sport or steadily moving through the ranks? The Sterling VR9 9.8 mm Dry-Core rope has a beefy core and 9.8 mm diameter for a lightweight rope on multi-pitch routes.",
      "categoryName": "ropes",
      "brandName": "Sterling",
      "smallImageFile1": "rope1-1.webp",
      "smallImageFile2": "rope1-2.webp",
      "largeImageFile": "rope1-3.jpg",
      "optionType": "Length",
      "options": [
          {
              "amountInStock": 5,
              "price": 119.95,
              "option": "40M"
          },
          {
              "amountInStock": 5,
              "price": 184.95,
              "option": "60M"
          },
          {
              "amountInStock": 5,
              "price": 219.95,
              "option": "70M"
          }
      ]
  }
  //POST new product
  {
    "productName": "Metolius Super Chalk - 4.5 oz"
    "description": "This 4.5 oz. bag of Metolius Super chalk is perfect for keeping your hands dry on the wall. Keep it in your car for trips to the crag or the gym, or use it to refill your reusable chalk bag.",
    "categoryName": "chalk",
    "brandName": "Metolius",
    "smallImageFile1": "chalk1-1.jpg",
    "smallImageFile2": "chalk1-2.jpg",
    "largeImageFile": "chalk1-3.jpg",
    "optionType": "None",
    options: [
      {
        "option": "Default",
        "amountInStock": 5,
        "price": 4.95
      }
    ]
  }
*/
productRouter.post("/", checkAuthenticatedAsAdmin, async (req, res, next) => {
  try {
    const body = req.body;
    if (
      body.productName === undefined ||
      body.description === undefined ||
      body.categoryName === undefined ||
      body.brandName === undefined ||
      body.optionType === undefined ||
      body.smallImageFile1 === undefined ||
      body.smallImageFile2 === undefined ||
      body.largeImageFile === undefined
    ) {
      throw createHttpError(
        400,
        "Missing item in the body. Needs a productName, description, categoryName, brandName, smallImageFile1, smallImageFile2, largeImageFile, and optionType "
      );
    }
    body.options.forEach((e) => {
      if (
        e.option === undefined ||
        e.amountInStock === undefined ||
        e.price === undefined
      ) {
        throw createHttpError(
          400,
          "Missing item in option. All elements need an option, price and amountInStock"
        );
      }
    });
    const newProduct = await Product.create(
      {
        productName: body.productName,
        description: body.description,
        categoryName: body.categoryName,
        brandName: body.brandName,
        optionType: body.optionType,
        smallImageFile1: body.smallImageFile1,
        smallImageFile2: body.smallImageFile2,
        largeImageFile: body.largeImageFile,
      },
      {
        returning: true,
      }
    );
    const newOptions = [];
    body.options.forEach((e) => {
      const newOption = {
        option: e.option,
        productId: newProduct.id,
        amountInStock: e.amountInStock,
        price: e.price,
      };
      newOptions.push(newOption);
    });
    await ProductOption.bulkCreate(newOptions);
    const sendThis = {
      product: newProduct,
      options: newOptions
    }
    res.status(200).send(sendThis);
  } catch (err) {
    next(err);
  }
});

/*
Update a productOption with ID using any combination of option, amountInStock, and price
{
  "option": "Small",
  "amountInStock": 2,
  "price": 64.95
}
*/
productRouter.put(
  "/option/:id",
  checkAuthenticatedAsAdmin,
  async (req, res, next) => {
    try {
      const body = req.body;
      const productOptionId = req.params.id;
      const newOption = body.option;
      const newPrice = body.price;
      const newAmountInStock = body.amountInStock;
      let dbResponse = null;
      if (newOption) {
        dbResponse = await ProductOption.update(
          {
            option: newOption,
          },
          { where: { id: productOptionId }, returning: true }
        );
      }
      if (newPrice) {
        dbResponse = await ProductOption.update(
          {
            brandName: newPrice,
          },
          { where: { id: productOptionId }, returning: true }
        );
      }
      if (newAmountInStock && Number.isInteger(newAmountInStock)) {
        dbResponse = await ProductOption.update(
          {
            amountInStock: newAmountInStock,
          },
          { where: { id: productOptionId }, returning: true }
        );
      }
      //If the ID was found but none of the items in the body were valid
      if (dbResponse === null) {
        res
          .status(400)
          .send(
            "There is nothing in the request body to update the product with"
          );
        return;
      }
      //Unable to find ID
      if (dbResponse[1].length === 0) {
        res
          .status(404)
          .send(`Unable to find product with id#${productOptionId}`);
      }
      res.status(200).send(dbResponse[1][0]);
    } catch (err) {
      next(err);
    }
  }
);

/*
  Update product with ID using any combination of productName, description,
    categoryName, and brandName
  {
    "productName": "Sama Harness - Men's Large",
    "price": 84.95,
  }
*/
productRouter.put("/:id", checkAuthenticatedAsAdmin, async (req, res, next) => {
  try {
    const body = req.body;
    const productId = req.params.id;
    const newProductName = body.productName;
    const newDescription = body.description;
    const newCategoryName = body.categoryName;
    const newBrandName = body.brandName;
    let dbResponse = null;
    if (newProductName) {
      dbResponse = await Product.update(
        {
          productName: newProductName,
        },
        { where: { id: productId }, returning: true }
      );
    }
    if (newDescription) {
      dbResponse = await Product.update(
        {
          description: newDescription,
        },
        { where: { id: productId }, returning: true }
      );
    }
    if (newCategoryName) {
      dbResponse = await Product.update(
        {
          categoryName: newCategoryName,
        },
        { where: { id: productId }, returning: true }
      );
    }
    if (newBrandName) {
      dbResponse = await Product.update(
        {
          brandName: newBrandName,
        },
        { where: { id: productId }, returning: true }
      );
    }
    //If the ID was found but none of the items in the body were valid
    if (dbResponse === null) {
      res
        .status(400)
        .send(
          "There is nothing in the request body to update the product with"
        );
      return;
    }
    //Unable to find ID
    if (dbResponse[1].length === 0) {
      res.status(404).send(`Unable to find product with id#${productId}`);
    }
    res.status(200).send(dbResponse[1][0]);
  } catch (err) {
    next(err);
  }
});

//Delete one productOption
productRouter.delete(
  "/option/:id",
  checkAuthenticatedAsAdmin,
  async (req, res, next) => {
    try {
      const idToDelete = req.params.id;
      const productOptionToDelete = await ProductOption.findOne({
        where: { id: idToDelete }
      });
      if (!productOptionToDelete) { 
        throw createHttpError(404, 'No product option with that id was found');
      }
      await ProductOption.destroy({
        where: { id: idToDelete }
      });
      res.status(200).send(`Deleted product option with id: ${idToDelete}`)
    } catch (err) {
      next(err);
    }
  }
)

//Delete a product and all of its options
productRouter.delete(
  "/:id",
  checkAuthenticatedAsAdmin,
  async (req, res, next) => {
    try {
      const idToDelete = req.params.id;
      const ordersFound = await OrderItem.findOne({
        where: { productId: idToDelete },
      });
      if (ordersFound) {
        throw createHttpError(
          400,
          `Unable to delete a product that is being used in orders`
        );
      }
      const productToDelete = await Product.findOne({
        where: { id: idToDelete },
      });
      if (!productToDelete) {
        throw createHttpError(
          404,
          `Product with id#${idToDelete} does not exist`
        );
      }
      await ProductOption.destroy({
        where: {
          productId: idToDelete,
        },
      });
      await Product.destroy({
        where: {
          id: idToDelete,
        },
      });
      res.status(200).send(`Deleted product with id: ${idToDelete}`);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = productRouter;
