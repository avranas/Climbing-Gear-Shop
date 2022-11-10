const { DataTypes } = require('sequelize');
const db = require('../db/db_setup');
const Product = require('./products');

const ProductOption = db.define('product_option', {
  option: DataTypes.TEXT,
  amountInStock: DataTypes.INTEGER,
  productId: DataTypes.INTEGER,
  price: DataTypes.FLOAT,
});

Product.hasMany(ProductOption);
ProductOption.belongsTo(Product);

module.exports = ProductOption;