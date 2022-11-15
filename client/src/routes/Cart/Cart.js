import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCart, loadCartData } from "../../slices/cartSlice";
import "./Cart.css";

const Cart = (props) => {

  const dispatch = useDispatch();
  const cart = useSelector(selectCart);

  useEffect(() => {
    const fetchData = async () => {
      //Get cart from back end if logged in.
      //Get it from localStorage if not
      try {
        loadCartData(dispatch);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [dispatch]);

  return (
    <section id="cart" className="container">
      <h2>Shopping Cart</h2>
      {
        cart.cartItems.length === 0 ?
        <p>Your shopping cart is empty</p>
        :
        cart.cartItems.map((i, key) => {
          return <div key={key}>
            <p>{i.productId}</p>
            <p>{i.optionSelection}</p>
            <p>{i.quantity}</p>
            </div>
        })
      }

    </section>
  );
};

export default Cart;
