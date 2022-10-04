const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const passport = require('./passport-config');
const session = require('express-session');

app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/user', require('./routes/user'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/product', require('./routes/product'));
app.use('/category', require('./routes/category'));
app.use('/cart', require('./routes/cart'));
app.use('/checkout', require('./routes/checkout'));
app.use('/order', require('./routes/order'));

app.get('/', (req, res) => {
  console.log('Hello world')
  res.status(200).send('Hello world');
});

app.get('/', (err, req, res, next) => {
  if (!res.headersSent) {
    res.status(500 || err.status).send(err);
  }
  console.log(err);
});

app.listen(PORT, () => {
  console.log('Now listening on Port: ' + PORT);
});

