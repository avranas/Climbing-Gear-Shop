const express = require("express");
require("dotenv").config();

const authenticatedRouter = express.Router();

authenticatedRouter.get("/", async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

authenticatedRouter.get("/admin", async (req, res, next) => {
  if (req.isAuthenticated() && req.user.userEmail === process.env.ADMIN_NAME) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

module.exports = authenticatedRouter;
