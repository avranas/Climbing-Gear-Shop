const express = require("express");
require("dotenv").config();
const { checkNotAuthenticated } = require("./authentication-check");
const passport = require("../passport-config");

//This route is for oauth requests
const authRouter = express.Router();

authRouter.get(
  "/auth/github",
  checkNotAuthenticated,
  passport.authenticate("github", { scope: ["user:email"] })
);

authRouter.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=1`,
    successRedirect: `${process.env.CLIENT_URL}/successful-login`,
  })
);

authRouter.get(
  "/auth/google",
  checkNotAuthenticated,
  passport.authenticate("google", { scope: ["email", "profile"] })
);

authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.CLIENT_URL}/successful-login`,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=1`,
  })
);


module.exports = authRouter;
