const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const passport = require('./passport-config');
const session = require('express-session');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const morgan = require('morgan');
//Use req.rawBody to access raw JSON
//Use req.body to access parsed JSON
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}));

app.use(cors());
app.use(morgan('tiny'));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
//Allows us to request images with the "/images" route in the "/assets/images" folder
app.use('/images', express.static(__dirname + '/assets/images'));

app.use('/user', require('./routes/user'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/product', require('./routes/product'));
app.use('/category', require('./routes/category'));
app.use('/cart', require('./routes/cart'));
app.use('/checkout', require('./routes/checkout'));
app.use('/order', require('./routes/order'));
app.use('/authenticated', require('./routes/authenticated'));
app.use('/webhook', require('./routes/webhook'))

app.get('/', (req, res) => {
  console.log('Hello world')
  res.status(200).send('Hello world');
});

app.use((err, req, res, next) => {
  if (!res.headersSent) {
    res.status(err.status || 500).send(err.message);
  }
  console.log(err);
});

app.listen(PORT, () => {
  console.log('Now listening on Port: ' + PORT);
});

