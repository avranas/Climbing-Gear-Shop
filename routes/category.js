const express = require('express');
const categoryRouter = express.Router();
var createError = require('http-errors');

categoryRouter.get('/', (req, res, next) => {
  
});

/*
	•	/category
	⁃	GET /category (all category data)
	⁃	GET /category/:id (all products)
	⁃	POST /category
	⁃	PUT /category/:id (add product)
	⁃	PUT /category/:id (name change)
	⁃	DELETE /category/:id
 */

module.exports = categoryRouter;