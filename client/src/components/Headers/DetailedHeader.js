import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import HeaderUserButtons from "../HeaderUserButtons/HeaderUserButtons";
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
      <div className="container" id="detailed-header-content">
        <Link to="/">
          <div className="logo col-2 header-item" />
        </Link>
        <div className="col-4 header-item">
          <SearchBar />
        </div>
          {loggedIn && user.name ?  (
            <div className="col-1 header-item" id="welcome-message">
              <p>Welcome,</p>
              <p>{firstName}</p>
            </div>
          ): null}
        <div className="col-2 header-item">
          <HeaderUserButtons />
        </div>
        <div className="col-1 header-item">
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
