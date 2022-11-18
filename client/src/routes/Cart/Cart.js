import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCart,
  loadCartData,
  changeQuantityInGuestCart,
  deleteFromGuestCart,
} from "../../slices/cartSlice";
import numberToUSD from "../../utils/numberToUSD";
import { Link } from "react-router-dom";

import "./Cart.css";
import CartQuantitySelection from "../../components/CartQuantitySelection/CartQuantitySelection";
import axios from "axios";

const Cart = (props) => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadCartData(dispatch);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleQuantitySelection = async (e, cartItem) => {
    const response = await axios("/authenticated");
    const value = e.target.value;
    if (response.data) {
      const requestBody = {
        quantity: Number(value),
        productId: cartItem.product.id,
        optionSelection: cartItem.optionSelection,
      };
      //Change quantity in cart on server
      await axios.put("/cart", requestBody);
    } else {
      //Change quantity in guest cart
      changeQuantityInGuestCart(cartItem, value);
    }
    loadCartData(dispatch);
  };
  const deleteItem = async (e) => {
    const id = e.target.value;
    const response = await axios("/authenticated");
    if (response.data) {
      //Delete from cart on server
      await axios.delete(`/cart/${id}`);
    } else {
      //Delete from guest cart
      deleteFromGuestCart(id);
    }
    loadCartData(dispatch);
  };

  return (
    <section id="cart" className="container styled-box">
      <h2>Shopping Cart</h2>
      {cart.isLoading ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : cart.cartItems.length === 0 ? (
        <div id="empty-cart">
          <p>Your shopping cart is empty</p>
        </div>
      ) : (
        cart.cartItems.map((i, key) => {
          return (
            <div className="cart-item" key={key}>
              <div className="cart-item-image">
                <img
                  src={`http://localhost:3000/images/${i.product.smallImageFile1}`}
                  alt="cart item"
                />
              </div>
              <div className="cart-item-content">
                <p>
                  {i.product.optionType}: {i.optionSelection}
                </p>
                <p>{i.product.brandName}</p>
                <p>{i.product.productName}</p>
                <strong>
                  <p>{numberToUSD(i.product.productOptions[0].price)}</p>
                </strong>
                <div className="cart-item-options">
                  <CartQuantitySelection
                    handleSelection={handleQuantitySelection}
                    cartItem={i}
                    defaultValue={i.quantity}
                  />
                  <button
                    id="remove-from-cart"
                    onClick={deleteItem}
                    value={i.id}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
      <div id="cart-footer">
        {cart.cartItems.length === 0 ? (
          <Link to="/products">
            <button className="important-button">Contine shopping</button>
          </Link>
        ) : (
          <div>
            <p>{`Subtotal (${cart.itemCount} items): ${numberToUSD(
              cart.subTotal
            )}`}</p>
            <div id="cart-buttons">
              <button className="important-button">Continue to checkout</button>
              <button className="semi-important-button">Continue shopping</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
