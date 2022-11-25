const express = require('express');
const checkoutRouter = express.Router();
const createHttpError = require('http-errors');
const { checkAuthenticated, checkAuthenticatedAsAdmin } = require('./authentication-check');
const Order = require('../models/orders');
const CartItem = require('../models/cartItems');
const Product = require('../models/products');
const OrderItem = require('../models/orderItems');
const ProductOption = require('../models/productOptions');
const getUserCartData = require("./getUserCartData");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

checkoutRouter.post('/create-checkout-session', checkAuthenticated, async (req, res, next) => {
  try {
    const items = await getUserCartData(req.user.id, next);

    //Take info from the request body and put it in the Stripe session
    const body = req.body;
    const phoneNumber = body.phoneNumber;
    const billingAddress = body.billingAddress;
    const shippingAddress = body.shippingAddress;
    const stripeBillingAddress = {
      line1: billingAddress.streetAddress1,
      line2: billingAddress.streetAddress2,
      city: billingAddress.city,
      state: billingAddress.state,
      postal_code: billingAddress.zipCode,
      country: billingAddress.country,
    }
    const stripeShippingAddress = {
      line1: shippingAddress.streetAddress1,
      line2: billingAddress.streetAddress2,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postal_code: shippingAddress.zipCode,
      country: shippingAddress.country,
    }
    const customer = await stripe.customers.create({
      address: stripeBillingAddress,
      shipping: {
        address: stripeShippingAddress,
        name: `${billingAddress.firstName} ${billingAddress.lastName}`,
        phone: phoneNumber
      },
      email: req.user.userEmail,
      name: `${billingAddress.firstName} ${billingAddress.lastName}`,
      phone: phoneNumber
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customer.id,
      metadata: {
        userId: req.user.id,
        shippingAddress: JSON.stringify(stripeShippingAddress)
      },
      //customer_email: req.user.userEmail,
      mode: 'payment',
      shipping_options: [{
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: 'usd'
          },
          display_name: "Next day air",
          tax_behavior: "inclusive",
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 1,
            },
            maximum: {
              unit: 'business_day',
              value: 1,
            },
          }
        }
      }],
      line_items: items.map(i => {
        return {
          price_data: {
            currency: "usd",
            tax_behavior: "exclusive",
            product_data: {
              name: `${i.product.productName} - ${i.optionSelection}`
            },
            unit_amount: i.product.productOptions[0].price
          },
          quantity: i.quantity
        }
      }),
      automatic_tax: {
        enabled: 'true'
      },
      success_url: `${process.env.CLIENT_URL}/order-placed`,
      cancel_url:  `${process.env.CLIENT_URL}/cart`
    })
    console.log('end of create checkout session')
    console.log(session.url)
    res.json({url: session.url});
  } catch (err) {
    console.log('nooooooooo')
    console.log(err)
    next(err);
  }
});

//TODO: I need a precheckout method. Check to make sure everything looks good before charging the customer
  //quantity < amountInStock
  //

//Grab info from shopping cart, charge customer, create new Order, empty shopping cart


module.exports = checkoutRouter;


//TODO NEXT: Tryna figure out if it's possible to send a billing address to Stripe
//Try creating a customer object, putting in the billing address, then sending the
//customer to Stripe. Will this work?
