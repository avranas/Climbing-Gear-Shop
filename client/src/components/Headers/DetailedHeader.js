import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import HeaderUserButtons from "../HeaderButtons/HeaderButtons";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../slices/userSlice";
import { useEffect, useState } from "react";
import "./Header.css";
import { selectCart, loadCartData } from "../../slices/cartSlice";
import axios from "axios";

const DetailedHeader = (props) => {
  const cart = useSelector(selectCart);
  const cartData = cart.data;
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState(false);
  const user = useSelector(selectUser);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios("/authenticated");
        if (response.data) {
          const response = await axios.get("/user");
          setLoggedIn(true);
          dispatch({ type: "user/loadUserData", payload: response.data });
        }
      } catch (err) {
        console.log(err);
      }
    };
    loadCartData(dispatch);
    getUserData();
  }, [dispatch]);
  let firstName = "";
  if (user.name) {
    firstName = user.name.split(" ")[0];
  }

  return (
    <header className="header">
      <div id="detailed-header-content">
        <Link to="/">
          <div id="detailed-header-logo" className="logo header-item" />
        </Link>
        <div className="header-item">
          <SearchBar />
        </div>
        {loggedIn && user.name ? (
          <div className="header-item" id="welcome-message">
            <p>Welcome,</p>
            <p>{firstName}</p>
          </div>
        ) : (
          <div className="header-item" id="welcome-message">
            {" "}
          </div>
        )}
        <div id="header-user-buttons-container" className="header-item">
          <HeaderUserButtons />
        </div>
        <div className="header-item">
          <Link to="/cart">
            <div id="cart-icon">
              {cartData.itemCount > 99 ? (
                <div className="cart-items-count" id="double-digit">
                  99+
                </div>
              ) : cartData.itemCount > 9 ? (
                <div className="cart-items-count" id="double-digit">
                  {cartData.itemCount}
                </div>
              ) : cartData.itemCount > 0 ? (
                <div className="cart-items-count" id="single-digit">
                  {cartData.itemCount}
                </div>
              ) : null}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DetailedHeader;
