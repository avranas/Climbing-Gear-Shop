const stripe = require("stripe");
const express = require("express");
const getUserCartData = require("./getUserCartData");
const User = require("../models/users");
const ProductOption = require("../models/productOptions");
const Order = require("../models/orders");
const CartItem = require("../models/cartItems");
const OrderItem = require("../models/orderItems");
const stripeWebhook = express.Router();

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_CLI_WEBHOOK_SECRET;

stripeWebhook.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    // Handle the event
    switch (event.type) {
      case "checkout.session.expired": {
        //Checkout session expired without payment. Increase amount in stock.
        const userId = event.data.object.metadata.userId;
        const cart = await getUserCartData(userId);
        await Promise.all(
          cart.map(async (i) => {
            ProductOption.increment(
              {
                amountInStock: i.quantity,
              },
              { where: { id: i.product.productOptions[0].id } }
            );
          })
        );
        break;
      }
      case "charge.succeeded":
        break;
      case "payment_intent.succeeded":
        break;
      case "payment_intent.created":
        break;
      case "checkout.session.completed": {
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata.userId;
        const grandTotal = paymentIntent.amount_total;
        const subTotal = paymentIntent.amount_subtotal;
        const taxCharged = paymentIntent.total_details.amount_tax;
        const shippingAddress = JSON.parse(
          paymentIntent.metadata.shippingAddress
        );
        const newOrderItems = [];
        const cart = await getUserCartData(userId);
        //Create a new Order and get its ID
        const newOrder = await Order.create(
          {
            subTotal: subTotal,
            taxCharged: taxCharged,
            totalPrice: grandTotal,
            orderStatus: "Placed",
            userId: userId,
            deliveryStreetAddress1: shippingAddress.line1,
            deliveryStreetAddress2: shippingAddress.line2,
            deliveryCity: shippingAddress.city,
            deliveryState: shippingAddress.state,
            deliveryZipCode: shippingAddress.postal_code,
            deliveryCountry: shippingAddress.country,
            shippingFeeCharged: paymentIntent.total_details.amount_shipping,
            timeCreated: Date.now(),
          },
          {
            returning: true,
          }
        );
        //For each item in the cart, create a new OrderItem
        cart.forEach((i) => {
          const newOrderItem = {
            price: i.product.productOptions[0].price,
            quantity: i.quantity,
            productId: i.product.id,
            orderId: newOrder.id,
            optionSelection: i.optionSelection,
          };
          newOrderItems.push(newOrderItem);
        });
        await OrderItem.bulkCreate(newOrderItems);

        //Empty the user's cart after the order has been placed.
        await CartItem.destroy({
          where: { userId: userId },
        });

        //Update user's rewards points
        const pointsToAdd = Math.floor(subTotal / 100);
        await User.increment(
          {
            rewardsPoints: pointsToAdd,
          },
          { where: { id: userId } }
        );
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send();
  }
);

module.exports = stripeWebhook;
