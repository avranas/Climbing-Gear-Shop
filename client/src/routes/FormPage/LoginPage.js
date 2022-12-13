import redX from "../../images/red-x.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./FormPage.css";
import { createNotification } from "../../slices/notificationSlice";
import axios from "axios";
import { loadCartData, moveGuestCartItemsToUserCart } from "../../slices/cartSlice";
import github from "../../images/github.png";
import google from "../../images/google.png";

//Next tells the login page where to navigate to after a successful login
//Error is a code that tells the login page what error page to display to a user
const LoginPage = ({ next, error }) => {
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

      if (next) {
        navigate(`/${next}`);
      } else {
        navigate("/");
      }

      createNotification(dispatch, "You are now logged in!");

      await moveGuestCartItemsToUserCart();


      loadCartData(dispatch);
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

  //Load the page with an error message
  useEffect(() => {
    switch (error) {
      case "1":
        setInvalidLoginError(`The email with the associated account is already registered.`);
        break;
      default:
        break;
    }
  }, [error]);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // const response = await axios('/authenticated');
        // if (response.data) {
        //  navigate('/orders');
        // }
      } catch (err) {
        console.log(err);
      }
    };
    checkAuthentication();
  }, [navigate]);

  //Navigate to the home page if you're already logged in
  useEffect(() => {
    const checkNotAuthenticated = async () => {
      const response = await axios("/authenticated");
      if (response.data) {
        navigate("/");
      }
    }
    checkNotAuthenticated();

  }, [navigate])

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const loginWithGitHub = async (e) => {
    try {
      window.location.href = `${process.env.REACT_APP_SERVER_URL}/auth/github`;
    } catch (err) {
      console.log(err);
    }
  };

  const loginWithGoogle = async (e) => {
    try {
      window.location.href = `${process.env.REACT_APP_SERVER_URL}/auth/google`;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="container form-page form-header-wrap styled-box">
      <h2>Login</h2>
      <div className="form">
        <div className="input-item">
          <label className="form-label" htmlFor="user-email">
            Email
          </label>
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
              <img alt="error" src={redX} />
              <p>{emailError}</p>
            </div>
          )}
        </div>
        <div className="input-item">
          <label className="form-label" htmlFor="password">
            Password
          </label>
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
              <img alt="error" src={redX} />
              <p>{passwordError}</p>
            </div>
          )}
        </div>
        <div className="form-break"></div>
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
            <img alt="error" src={redX} />
            <p>{invalidLoginError}</p>
          </div>
        )}
      </div>
      <h3>Or login using:</h3>
      <div id="oauth-buttons">
        <button className="oauth-button" id="github" onClick={loginWithGitHub}>
          <img alt="github" src={github} />
        </button>
        <button className="oauth-button" id="google" onClick={loginWithGoogle}>
          <img alt="google" src={google}/>
        </button>
      </div>
      <p className="form-page-footer">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </main>
  );
};

export default LoginPage;
