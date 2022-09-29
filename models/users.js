const { DataTypes } = require('sequelize');
const db = require('../db/db_setup');

const User = db.define('users', {
  username: DataTypes.TEXT,
  password: DataTypes.TEXT,
  firstName: DataTypes.TEXT,
  lastName: DataTypes.TEXT,
  address: DataTypes.TEXT,
  rewardsPoints: DataTypes.INTEGER
});

module.exports = User;