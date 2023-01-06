const express = require("express");
require("dotenv").config();

//This route is for oauth requests
const authRouter = express.Router();

app.get(
  "/auth/github",
  checkNotAuthenticated,
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=1`,
    successRedirect: `${process.env.CLIENT_URL}/successful-login`,
  })
);

app.get(
  "/auth/google",
  checkNotAuthenticated,
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.CLIENT_URL}/successful-login`,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=1`,
  })
);


module.exports = authRouter;
