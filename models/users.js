const { DataTypes } = require('sequelize');
const db = require('../db/db_setup');

const User = db.define('users', {
  userEmail: DataTypes.TEXT,
  password: DataTypes.TEXT,
  firstName: DataTypes.TEXT,
  lastName: DataTypes.TEXT,
  homeAddress: DataTypes.TEXT,
  rewardsPoints: DataTypes.INTEGER
});

module.exports = User;