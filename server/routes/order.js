const express = require("express");
const orderRouter = express.Router();
const createHttpError = require("http-errors");
const {
  checkAuthenticated,
  checkAuthenticatedAsAdmin,
} = require("./authentication-check");
const Order = require("../models/orders");
const OrderItem = require("../models/orderItems");
const Product = require("../models/products");

//orderId is optional
const getOrders = async (userId, orderId) => {
  let whereOptions = null;
  if (orderId) {
    whereOptions = {
      userId: userId,
      id: orderId,
    };
  } else {
    whereOptions = {
      userId: userId,
    };
  }
  const response = await Order.findAll({
    where: whereOptions,
    order: [["timeCreated", "DESC"]],
    attributes: [
      "deliveryCity",
      "deliveryCountry",
      "deliveryState",
      "deliveryStreetAddress1",
      "deliveryStreetAddress2",
      "deliveryZipCode",
      "totalPrice",
      "taxCharged",
      "shippingFeeCharged",
      "subTotal",
      "timeCreated",
      "orderStatus",
      "id",
    ],
    include: [
      {
        model: OrderItem,
        as: "orderItems",
        required: true,
        attributes: ["optionSelection", "price", "quantity"],
        include: [
          {
            model: Product,
            required: true,
            attributes: [
              "id",
              "brandName",
              "optionType",
              "productName",
              "smallImageFile1",
            ],
          },
        ],
      },
    ],
    subQuery: false,
  });
  return response;
};

//Get all of a user's orders
orderRouter.get("/", checkAuthenticated, async (req, res, next) => {
  try {
    const response = await getOrders(req.user.id);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
});

//get most recent order
orderRouter.get("/newest", checkAuthenticated, async (req, res, next) => {
  try {
    //There's a bug with sequilize where only one product is being returned
    //Using findAll() and returning response.data[0] instead of findOne()
    //bypasses this
    const response = await getOrders(req.user.id);
    res.status(200).send(response[0]);
  } catch (err) {
    next(err);
  }
});

//Get an order and its order items by ID.
//The order must belong to the logged in user
orderRouter.get("/:id", checkAuthenticated, async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const response = await getOrders(req.user.id, orderId);
    if (response.length === 0) {
      throw createHttpError(404, `Order with id#${orderId} not found`);
    } else {
      res.status(200).send(response[0]);
    }
  } catch (err) {
    next(err);
  }
});

/*
  Update status of order
  {
    "newStatus": "Shipped", "Complete", "On backorder", "Cancelled",
      "Returning", "Returning-Shipped", "Returned" are all valid options
  }
*/
orderRouter.put("/:id", checkAuthenticatedAsAdmin, async (req, res, next) => {
  try {
    const newStatus = req.body.newStatus;
    if (
      newStatus !== "Shipped" &&
      newStatus !== "Complete" &&
      newStatus !== "Cancelled" &&
      newStatus !== "On backorder" &&
      newStatus !== "Cancelled" &&
      newStatus !== "Returning" &&
      newStatus !== "Returning-Shipped" &&
      newStatus !== "Returned"
    ) {
      throw createHttpError(400, "Invalid entry for newStatus");
    } else {
      const orderId = req.params.id;
      const updatedOrder = await Order.update(
        {
          orderStatus: newStatus,
        },
        {
          where: { id: orderId },
          returning: true,
        }
      );
      if (updatedOrder[1].length === 0) {
        //If no order was found
        throw createHttpError(404, `Unable to find order with id#${orderId}`);
      }
      res.status(200).send(`Updated order status to ${newStatus}`);
    }
  } catch (err) {
    next(err);
  }
});

//Delete order and all of its OrderItems
orderRouter.delete(
  "/:id",
  checkAuthenticatedAsAdmin,
  async (req, res, next) => {
    try {
      const idToDelete = req.params.id;
      const orderToDelete = await Order.findOne({
        where: { id: idToDelete },
      });
      if (!orderToDelete) {
        throw createHttpError(404, "No order with that id was found");
      }
      await OrderItem.destroy({
        where: { orderId: idToDelete },
      });
      await Order.destroy({
        where: { id: idToDelete },
      });
      res.status(200).send(`Deleted order#${idToDelete}`);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = orderRouter;
