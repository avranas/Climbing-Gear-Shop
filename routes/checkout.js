const express = require("express");
const checkoutRouter = express.Router();
const createHttpError = require("http-errors");
const {
  checkAuthenticated,
} = require("./authentication-check");
const ProductOption = require("../models/productOptions");
const getUserCartData = require("./getUserCartData");
const User = require("../models/users");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

checkoutRouter.post(
  "/create-checkout-session",
  checkAuthenticated,
  async (req, res, next) => {
    try {
      const items = await getUserCartData(req.user.id);

      //Double-check to confirm we have enough of every item in stock
      items.forEach((i) => {
        if (i.quantity > i.product.productOptions[0].amountInStock) {
          throw createHttpError(
            400,
            `There is not enough of item: ${i.product.productName} ${i.product.optionType}: ${i.product.productOptions[0].option} in stock to fulfill your order. Please reduce the quantity`
          );
        }
      });
      //Now that we've confirmed we have enough of every item in stock
      //Decrement amountInStock for each item
      await Promise.all(
        items.map(async (i) => {
          ProductOption.increment(
            {
              amountInStock: i.quantity * -1,
            },
            { where: { id: i.product.productOptions[0].id } }
          );
        })
      );
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
      };
      const stripeShippingAddress = {
        line1: shippingAddress.streetAddress1,
        line2: billingAddress.streetAddress2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postal_code: shippingAddress.zipCode,
        country: shippingAddress.country,
      };
      const customer = await stripe.customers.create({
        address: stripeBillingAddress,
        email: req.user.userEmail,
        name: `${billingAddress.firstName} ${billingAddress.lastName}`,
        phone: phoneNumber,
      });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer: customer.id,
        metadata: {
          userId: req.user.id,
          shippingAddress: JSON.stringify(stripeShippingAddress),
        },
        mode: "payment",
        expires_at: Math.floor(Date.now() / 1000 + 31 * 60),
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 0,
                currency: "usd",
              },
              display_name: "Next day air",
              tax_behavior: "inclusive",
              delivery_estimate: {
                minimum: {
                  unit: "business_day",
                  value: 1,
                },
                maximum: {
                  unit: "business_day",
                  value: 1,
                },
              },
            },
          },
        ],
        line_items: items.map((i) => {
          return {
            price_data: {
              currency: "usd",
              tax_behavior: "exclusive",
              product_data: {
                name: `${i.product.productName} - ${i.optionSelection}`,
              },
              unit_amount: i.product.productOptions[0].price,
            },
            quantity: i.quantity,
          };
        }),
        automatic_tax: {
          enabled: "true",
        },
        success_url: `${process.env.CLIENT_URL}/order-placed`,
        cancel_url: `${process.env.CLIENT_URL}/adgerdfgf`,
      });
      //Force session to expire after 5 minutes
      //When a session expires, each product's amountInStock is incremented
      setTimeout(async () => {
        if (session.status === "open") {
          await stripe.checkout.sessions.expire(session.id);
        }
      }, 1000 * 60 * 5);
      //Save session ID into the database, so it can be expired manually if the user goes back to
      //the checkout page
      await User.update(
        {
          checkoutSessionId: session.id,
        },
        {
          where: { id: req.user.id },
        }
      );
      res.json({ url: session.url });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

module.exports = checkoutRouter;
