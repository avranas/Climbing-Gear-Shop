const { DataTypes } = require('sequelize');
const db = require('../db/db_setup');
const OrderItem = require('../models/orderItems');

const Order = db.define('orders', {
  subTotal: DataTypes.FLOAT,
  taxCharged: DataTypes.FLOAT,
  totalPrice: DataTypes.FLOAT,
  orderStatus: DataTypes.TEXT, //Placed -> Shipped -> Completed
  userId: DataTypes.INTEGER,
  deliveryStreetAddress1: DataTypes.TEXT,
  deliveryStreetAddress2: DataTypes.TEXT,
  deliveryCity: DataTypes.TEXT,
  deliveryState: DataTypes.TEXT,
  deliveryZipCode: DataTypes.TEXT,
  deliveryCountry: DataTypes.TEXT
});

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

module.exports = Order;

