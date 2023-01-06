const CartItem = require("../models/cartItems");
const { Sequelize, Op } = require("sequelize");
const Product = require("../models/products");
const ProductOption = require("../models/productOptions");

const getUserCartData = async (userId) => {
  const foundCart = await CartItem.findAll({
    attributes: ["quantity", "optionSelection", "productId", "id"],
    include: [
      {
        model: Product,
        attributes: [
          "productName",
          "brandName",
          "optionType",
          "smallImageFile1",
          "id",
        ],
        required: true,
        include: [
          {
            attributes: ["price", "amountInStock", "id", "option"],
            model: ProductOption,
            as: "productOptions",
          },
        ],
      },
    ],
    where: {
      userId: userId,
      optionSelection: {
        [Op.eq]: Sequelize.col("option"),
      },
    },
  });
  return foundCart;
};

module.exports = getUserCartData;
