const { DataTypes } = require('sequelize');
const db = require('../db/db_setup');

const Order = db.define('orders', {
  totalPrice: DataTypes.FLOAT,
  orderStatus: DataTypes.TEXT, //Placed -> Shipped -> Completed
  userId: DataTypes.INTEGER
});

Cart.hasMany(CartItem);
CartItem.belongsTo(Cart);

module.exports = Order;