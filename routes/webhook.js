const stripe = require('stripe');
const express = require('express');
const getUserCartData = require('./getUserCartData');
const stripeWebhook = express.Router();


//TODO: Order in db doesn't have shipping info. Let's add it


const handleSuccessfulPayment = async (req, res, next) => {
  try {
    const userId = req.user.id;

    res.status(200).send(newOrder);
  } catch (err) {
    next(err);
  }
}

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_CLI_WEBHOOK_SECRET;

stripeWebhook.post('/', express.raw({type: 'application/json'}), async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  // Handle the event
  switch (event.type) {
    // case 'payment_intent.succeeded':
    // case 'charge.succeeded':
    // case 'payment_intent.created':
    case 'checkout.session.completed': {
      console.log(event.type)
      const paymentIntent = event.data.object;
      console.log(paymentIntent);
      const userId = paymentIntent.metadata.userId;
      const grandTotal = paymentIntent.amount_total;
      const subTotal = paymentIntent.amount_total;
      const taxCharged = paymentIntent.total_details.amount_tax;
      const shippingAddress = JSON.parse(paymentIntent.metadata.shippingAddress);
      //console.log(userId, grandTotal, subTotal, taxCharged, shippingAddress)
      
      console.log('shipping address:')
      console.log(shippingAddress)





      
      //TODO later: subtract amountInStock
      //What about rewards points? Scrap?
      const newOrderItems = [];
      const cart = await getUserCartData(userId, next);

      //Go through the cart, and add up all the totals
      cart.forEach(i => {
        console.log(i)
        subTotal += i.product.productOptions[0].price;
      });

      //Create a new Order and get its ID
      console.log(req.body.data)
      const newOrder = await Order.create({
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
        deliveryCountry: shippingAddress.country
      }, { 
        returning: true
      });


      //For each item in the cart, create a new OrderItem
      cart.forEach( i => {
        const newOrderItem = {
          price: i.product.productOptions[0].price,
          quantity: i.quantity,
          productId: i.product.id,
          orderId: newOrder.id,
          optionSelection: i.optionSelection
        };
        newOrderItems.push(newOrderItem);
      })
      await OrderItem.bulkCreate(newOrderItems);
      //Empty the user's cart after the order has been placed.
      await CartItem.destroy({
        where: { userId: userId }
      });









      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send();
});

module.exports = stripeWebhook;
