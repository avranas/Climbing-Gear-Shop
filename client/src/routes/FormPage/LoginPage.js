import redX from "../../images/red-x.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./FormPage.css";
import { createNotification } from "../../slices/notificationSlice";
import axios from "axios";
import { loadCartData } from "../../slices/cartSlice";

const LoginPage = ({ next }) => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userEmailInput, setUserEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [invalidLoginError, setInvalidLoginError] = useState("");
  const handleUserEmailChange = (e) => {
    setUserEmailInput(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPasswordInput(e.target.value);
    setPasswordError("");
  };

  const handleSubmit = async (e) => {
    try {
      let errorFound = false;
      if (userEmailInput === "") {
        setEmailError("This field is required");
        errorFound = true;
      }
      if (passwordInput === "") {
        setPasswordError("This field is required");
        errorFound = true;
      }
      if (errorFound) {
        return;
      }
      const requestBody = {
        userEmail: userEmailInput,
        password: passwordInput,
      };
      await axios.post("/login", requestBody);
      //If the passwords don't match, an error will be thrown
      const userData = await axios.get("/user");
      dispatch({ type: "user/loadUserData", payload: userData.data });

      console.log(next);
      if (next) {
        navigate(`/${next}`);
      } else {
        navigate("/");
      }

      createNotification(dispatch, "You are now logged in!");
      //If there are items in the guest's cart, move the data to
      //the server and clear it in localStorage
      const guestCart = JSON.parse(localStorage.getItem("guestCart"));
      if (!guestCart) {
        return;
      }
      await Promise.all(
        guestCart.map(async (i) => {
          await axios.post("/cart", i);
        })
      );
      loadCartData(dispatch);
      localStorage.removeItem("guestCart");
    } catch (err) {
      console.log(err);
      if (err.response.data === "You need to be logged out do that.") {
        setInvalidLoginError("You are already logged in!");
      } else if (err.response.data === "Unauthorized") {
        setInvalidLoginError("Email or password was incorrect!");
        setPasswordInput("");
      }
      console.log(err);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // const response = await axios('/authenticated');
        // if (response.data) {
        //  navigate('/profile');
        // }
      } catch (err) {
        console.log(err);
      }
    };
    checkAuthentication();
  }, [navigate]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <main className="container form-page">
      <div className="form-header-wrap styled-box">
        <h2>Login</h2>
        <div className="form">
          <div className="input-item">
            <label className="form-label" htmlFor="user-email">Email</label>
            <input
              type="email"
              id="user-email"
              name="user-email"
              className="form-control"
              value={userEmailInput}
              onChange={handleUserEmailChange}
              onKeyUp={handleKeyPress}
            />
            {emailError && (
              <div className="input-error-box">
                <img alt="x" src={redX} />
                <p>{emailError}</p>
              </div>
            )}
          </div>
          <div className="input-item">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              className="form-control"
              onKeyUp={handleKeyPress}
              type="password"
              id="password"
              name="password"
              value={passwordInput}
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <div className="input-error-box">
                <img alt="x" src={redX} />
                <p>{passwordError}</p>
              </div>
            )}
          </div>
          <button
            className="important-button"
            type="submit"
            value="Submit"
            onClick={handleSubmit}
            >
            Submit
          </button>
          {invalidLoginError && (
            <div className="input-error-box">
              <img alt="x" src={redX} />
              <p>{invalidLoginError}</p>
            </div>
          )}
        </div>
        <p className="form-page-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
