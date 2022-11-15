const { DataTypes } = require('sequelize');
const db = require('../db/db_setup');

const Product = db.define('products', {
  productName: DataTypes.TEXT,
  description: DataTypes.TEXT,
  categoryName: DataTypes.TEXT,
  brandName: DataTypes.TEXT,
  optionType: DataTypes.TEXT,
  smallImageFile1: DataTypes.TEXT,
  smallImageFile2: DataTypes.TEXT,
  largeImageFile: DataTypes.TEXT
});

module.exports = Product;