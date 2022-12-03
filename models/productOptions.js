const { DataTypes } = require('sequelize');
const db = require('../db/db_setup');
const Product = require('./products');

const ProductOption = db.define('product_options', {
  option: DataTypes.TEXT,
  amountInStock: DataTypes.INTEGER,
  productId: DataTypes.INTEGER,
  price: DataTypes.INTEGER,
});

Product.hasMany(ProductOption, {as: 'productOptions', foreignKey: 'productId'});
ProductOption.belongsTo(Product);

module.exports = ProductOption;