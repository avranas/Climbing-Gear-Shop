const { DataTypes } = require('sequelize');
const db = require('../db/db_setup');
const OrderItem = require('../models/orderItems');

const Order = db.define('orders', {
  subTotal: DataTypes.FLOAT,
  taxCharged: DataTypes.FLOAT,
  totalPrice: DataTypes.FLOAT,
  orderStatus: DataTypes.TEXT, //Placed -> Shipped -> Completed
  userId: DataTypes.INTEGER
});

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

module.exports = Order;