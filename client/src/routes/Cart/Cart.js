import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCart,
  loadCartData,
  changeQuantityInGuestCart,
  deleteFromGuestCart,
} from "../../slices/cartSlice";
import penniesToUSD from "../../utils/penniesToUSD";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";
import CartQuantitySelection from "../../components/CartQuantitySelection/CartQuantitySelection";
import axios from "axios";

const Cart = (props) => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const navigate = useNavigate();

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

  const continueToCheckout = async () => {
    const response = await axios('/authenticated');
    if (response.data) {
      navigate('/checkout');
    } else {
      navigate('/login?next=checkout');
    }
  }

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
                  src={`${process.env.REACT_APP_SERVER_URL}/images/${i.product.smallImageFile1}`}
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
                  <p>{penniesToUSD(i.product.productOptions[0].price)}</p>
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
            <p>{`Subtotal (${cart.itemCount} items): ${penniesToUSD(
              cart.subTotal
            )}`}</p>
            <div id="cart-buttons">
              <button onClick={continueToCheckout} className="important-button">Continue to checkout</button>
              <Link to="/products">
                <button className="semi-important-button">Continue shopping</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
