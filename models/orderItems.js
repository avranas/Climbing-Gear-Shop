const { DataTypes } = require('sequelize');
const db = require('../db/db_setup');
const Order = require('../models/orders');
const Product = require('./products');

const OrderItem = db.define('order_items', {
  price: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
  productId: DataTypes.INTEGER,
  orderId: DataTypes.INTEGER,
  optionSelection: DataTypes.TEXT
});

Order.hasMany(OrderItem, {as: 'orderItems', foreignKey: 'orderId'});
OrderItem.belongsTo(Order);
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

module.exports = OrderItem;