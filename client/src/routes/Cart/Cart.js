import { useEffect, useState } from "react";
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
import redX from "../../images/red-x.png";

const Cart = (props) => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const cartData = cart.data;
  const navigate = useNavigate();
  const [quantityChangeError, setQuantityChangeError] = useState("");

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
    let value = e.target.value;


    //Check to make sure there are enough items in stock
    const amountInStock = cartItem.product.productOptions[0].amountInStock;
    if(value > amountInStock) {
      value = amountInStock;
      if (value === 0) {
        setQuantityChangeError("This item is sold out.");
      } else {
        setQuantityChangeError("Not enough in stock. Setting to the max.");
      }
    }


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
    try {
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
    } catch (err) {
      loadCartData(dispatch);
    }
  };

  const continueToCheckout = async () => {
    const response = await axios('/authenticated');
    if (response.data) {
      navigate('/checkout');
    } else {
      navigate('/login?next=checkout');
    }
  }

  const backToProducts = async () => {
    navigate('/products/0')
  }

  return (
    <section id="cart" className="container styled-box">
      <h2>Shopping Cart</h2>
      {cart.isLoading ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : cartData.cartItems.length === 0 ? (
        <div id="empty-cart">
          <p>Your shopping cart is empty</p>
        </div>
      ) : (
        cartData.cartItems.map((i, key) => {
          return (
            <div className="cart-item" key={key}>
                <div className="cart-item-image">
                  <Link to={`/product/${i.product.id}`}>
                    <img
                      src={`${process.env.REACT_APP_SERVER_URL}/images/${i.product.smallImageFile1}`}
                      alt="cart item"
                    />
                  </Link>
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
                    className="small-button"
                    onClick={deleteItem}
                    value={i.id}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {quantityChangeError && (
                <div className="input-error-box">
                  <img alt="error" src={redX} />
                  <p>{quantityChangeError}</p>
                </div>
              )}
            </div>
          );
        })
      )}
      <div id="cart-footer">
        {cartData.cartItems.length === 0 ? (
          <Link to="/products/0">
            <button className="important-button">Contine shopping</button>
          </Link>
        ) : (
          <div>
            <p>{`Subtotal (${cartData.itemCount} items): ${penniesToUSD(
              cartData.subTotal
            )}`}</p>
            <div id="cart-buttons">
              <button onClick={continueToCheckout} className="important-button">Continue to checkout</button>
              <button onClick={backToProducts}className="semi-important-button">Continue shopping</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
