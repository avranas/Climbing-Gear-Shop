const express = require('express');
const categoryRouter = express.Router();
const createHttpError = require('http-errors');
const Product = require('../models/products');

categoryRouter.get('/:name', async (req, res, next) => {
  try {
    const dbResponse = await Product.findAll({
      where: { categoryName: req.params.name }
    });
    if (dbResponse.length === 0) {
      throw createHttpError(404, 'No products with that category name exist');
    }
    res.status(200).send(dbResponse);
  } catch (err) {
    next(err);
  }
});

module.exports = categoryRouter;
