if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { Sequelize } = require("sequelize");
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

const dbTest = async () => {
  try {
    await db.authenticate();
    console.log(
      `Connection to database: ${process.env.DB_NAME} ` +
        `has been established successfully.`
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

dbTest();

module.exports = db;
