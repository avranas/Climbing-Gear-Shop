const { DataTypes } = require("sequelize");
const db = require("../db/db_setup");

const User = db.define("users", {
  userEmail: DataTypes.TEXT,
  password: DataTypes.TEXT,
  name: DataTypes.TEXT,
  homeAddress: DataTypes.TEXT,
  rewardsPoints: DataTypes.INTEGER,
  checkoutSessionId: DataTypes.TEXT,
  githubId: DataTypes.INTEGER,
  googleId: DataTypes.TEXT,
});

module.exports = User;
