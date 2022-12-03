const { DataTypes } = require('sequelize');
const db = require('../db/db_setup');

const Order = db.define('orders', {
  subTotal: DataTypes.INTEGER,
  taxCharged: DataTypes.INTEGER,
  totalPrice: DataTypes.INTEGER,
  orderStatus: DataTypes.TEXT, //Placed -> Shipped -> Completed
  shippingFeeCharged: DataTypes.INTEGER,
  userId: DataTypes.INTEGER,
  deliveryStreetAddress1: DataTypes.TEXT,
  deliveryStreetAddress2: DataTypes.TEXT,
  deliveryCity: DataTypes.TEXT,
  deliveryState: DataTypes.TEXT,
  deliveryZipCode: DataTypes.TEXT,
  deliveryCountry: DataTypes.TEXT,
  timeCreated: DataTypes.BIGINT
});

module.exports = Order;

