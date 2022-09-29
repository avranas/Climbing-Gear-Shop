const { DataTypes } = require('sequelize');
const db = require('../db/db_setup');

const Product = db.define('products', {
  productName: DataTypes.TEXT,
  description: DataTypes.TEXT,
  price: DataTypes.FLOAT,
  categoryName: DataTypes.TEXT,
  brandName: DataTypes.TEXT,
  amountInStock: DataTypes.INTEGER
});

module.exports = Product;