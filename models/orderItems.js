const { DataTypes } = require('sequelize');
const db = require('../db/db_setup');
const Order = require('../models/orders');
const Product = require('../models/products');

const OrderItem = db.define('order_items', {
  price: DataTypes.FLOAT,
  quantity: DataTypes.INTEGER,
  productId: DataTypes.INTEGER,
  orderId: DataTypes.INTEGER
});

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

module.exports = OrderItem;