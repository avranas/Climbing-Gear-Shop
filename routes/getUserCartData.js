
const CartItem = require("../models/cartItems");
const { Sequelize, Op } = require("sequelize");
const Product = require("../models/products");
const ProductOption = require("../models/productOptions");

const getUserCartData = async (userId, next) => {
  try {
    const foundCart = await CartItem.findAll({
      attributes: ["quantity", "optionSelection", "productId", "id"],
      include: [
        {
          model: Product,
          attributes: ["productName", "brandName", "optionType",  "smallImageFile1", "id"],
          required: true,
          include: [
            {
              attributes: ["price", "amountInStock"],
              model: ProductOption, as: "productOptions"
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
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = getUserCartData;