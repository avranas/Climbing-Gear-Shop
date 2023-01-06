if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const nodeEnv = process.env.NODE_ENV;

const { Sequelize } = require("sequelize");

let db = null;

if (nodeEnv === "production") {
  db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "postgres",
      pool: {
        max: 5,
        min: 0,
        aquire: 30000,
        idle: 10000,
      },
      port: process.env.DB_PORT,
      timestamps: false,
      freezeTableName: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }
  );
} else {
  db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "postgres",
    }
  );
}

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
