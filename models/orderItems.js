const { DataTypes } = require('sequelize');
const db = require('../db/db_setup');

const OrderItem = db.define('order_items', {
  price: DataTypes.FLOAT,
  quantity: DataTypes.INTEGER,
  productId: DataTypes.INTEGER,
  orderId: DataTypes.INTEGER
});

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

module.exports = OrderItem;