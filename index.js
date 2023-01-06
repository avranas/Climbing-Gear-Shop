const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const passport = require("./passport-config");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");
const nodeEnv = process.env.NODE_ENV;
const path = require("path");

app.use(
  cors({
    allowedHeaders: ["Content-Type"],
    origin: "*",
    preflightContinue: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
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

/*
  Allows us to request images with the "/images" route in the "/assets/images"
  folder
*/
app.use("/images", express.static(__dirname + "/assets/images"));

//Serve static files from the React frontend app
console.log("nodeEnv:", nodeEnv);
if (nodeEnv === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

app.use("/auth", require("./routes/auth"));
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
app.get("/test", (req, res) => {
  console.log("Hello world");
  res.status(200).send("Hello world");
});

/*
  Error handling
  Leaving next as a param is neccessary because this is how express finds
  the error handler
*/
//eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!res.headersSent) {
    res.status(err.status || 500).send(err.message);
  }
  //Log requests method
  console.log(`${req.method} Request Received`);
  //Log stack trace for error
  console.error(err.stack);
  //Log error message
  console.log(err.message);
});

/*
  After defining your routes, anything that doesn't match what's above,
  we want to return index.html from our built React app
*/
if (nodeEnv === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
  });
}
app.listen(PORT, () => {
  console.log("Now listening on Port: " + PORT);
});
