const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const passport = require("./passport-config");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");
const { checkNotAuthenticated } = require("./routes/authentication-check");

app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("tiny"));
//Use req.rawBody to access raw JSON
//Use req.body to access parsed JSON
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.get("/auth/github", checkNotAuthenticated, (req, res, next) => {
  passport.authenticate('github'),
  console.log("??");
  res
    .status(200)
    .send(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
    );
});

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    successRedirect: `${process.env.CLIENT_URL}/`,
  })
);

//Allows us to request images with the "/images" route in the "/assets/images" folder
app.use("/images", express.static(__dirname + "/assets/images"));
app.use("/user", require("./routes/user"));
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));
app.use("/product", require("./routes/product"));
app.use("/category", require("./routes/category"));
app.use("/cart", require("./routes/cart"));
app.use("/checkout", require("./routes/checkout"));
app.use("/order", require("./routes/order"));
app.use("/authenticated", require("./routes/authenticated"));
app.use("/webhook", require("./routes/webhook"));

//Test route
app.get("/", (req, res) => {
  console.log("Hello world");
  res.status(200).send("Hello world");
});

//Error handling
app.use((err, req, res, next) => {
  if (!res.headersSent) {
    res.status(err.status || 500).send(err.message);
  }
  console.log(err);
});

app.listen(PORT, () => {
  console.log("Now listening on Port: " + PORT);
});
