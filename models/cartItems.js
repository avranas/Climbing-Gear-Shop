const { DataTypes } = require('sequelize');
const db = require('../db/db_setup');
const Product = require('./products');
const User = require('./users');

const CartItem = db.define('cart_items', {
  quantity: DataTypes.INTEGER,
  userId: DataTypes.INTEGER,
  productId: DataTypes.INTEGER
});

User.hasMany(CartItem);
CartItem.belongsTo(User);
Product.hasMany(CartItem);
CartItem.belongsTo(Product);


module.exports = CartItem;