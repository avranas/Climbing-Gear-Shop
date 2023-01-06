const express = require("express");
require("dotenv").config();

//This route is for the front end to check if users are authenticated
const authenticatedRouter = express.Router();

authenticatedRouter.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

authenticatedRouter.get("/admin", async (req, res) => {
  if (req.isAuthenticated() && req.user.userEmail === process.env.ADMIN_NAME) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

module.exports = authenticatedRouter;
