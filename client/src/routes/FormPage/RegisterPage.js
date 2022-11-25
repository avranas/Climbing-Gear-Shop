import { useCallback, useEffect, useState } from "react";
import redX from "../../images/red-x.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FormPage.css";
import { useDispatch, useSelector } from "react-redux";
import { createNotification } from "../../slices/notificationSlice";
import { selectUser } from "../../slices/userSlice";

const RegisterPage = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const [userEmailInput, setUserEmailInput] = useState("");
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [passwordInputA, setPasswordInputA] = useState("");
  const [passwordInputB, setPasswordInputB] = useState("");

  const [emailError, setEmailError] = useState(null);
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [passwordAError, setPasswordAError] = useState(null);
  const [passwordBError, setPasswordBError] = useState(null);

  const handleUserEmailChange = (e) => {
    setUserEmailInput(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setFirstNameInput(e.target.value);
    setFirstNameError(null);
  };

  const handleLastNameChange = (e) => {
    setLastNameInput(e.target.value);
    setLastNameError(null);
  };

  const handlePasswordAChange = (e) => {
    setPasswordInputA(e.target.value);
  };

  const handlePasswordBChange = (e) => {
    setPasswordInputB(e.target.value);
  };

  //Copy and pasted from Stack Overflow
  const validateEmail = useCallback(() => {
    const result = String(userEmailInput)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    if (result) {
      return true;
    } else {
      return false;
    }
  }, [userEmailInput]);

  const checkIfPasswordsMatch = useCallback(() => {
    if (passwordInputA === passwordInputB) {
      return true;
    } else {
      return false;
    }
  }, [passwordInputA, passwordInputB]);

  //Regex courtesy of Stack Overflow
  const checkIfPasswordMeetsRequirements = useCallback(() => {
    const result = String(passwordInputA).match(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/
    );
    if (result) {
      return true;
    } else {
      return false;
    }
  }, [passwordInputA]);

  const handleSubmit = async (e) => {
    try {
      let errorFound = false;
      if (!validateEmail(userEmailInput)) {
        setEmailError("Invalid email");
        //Change CSS
        errorFound = true;
      }
      if (!checkIfPasswordMeetsRequirements()) {
        setPasswordAError(
          "Password must have at least 6 characters, 1 number, 1 letter, and 1 special character"
        );
        errorFound = true;
      }
      if (!checkIfPasswordsMatch()) {
        setPasswordBError("Both passwords must match");
        errorFound = true;
      }
      if (!firstNameInput) {
        setFirstNameError("This field is required");
        errorFound = true;
      }
      if (!lastNameInput) {
        setLastNameError("This field is required");
        errorFound = true;
      }
      if (errorFound) {
        return;
      }
      const requestBody = {
        userEmail: userEmailInput,
        firstName: firstNameInput,
        lastName: lastNameInput,
        password: passwordInputA,
      };

      const response = await axios.post("/register", requestBody);
      //Create notification for successful registration
      createNotification(dispatch, "Account successfully created!");

      navigate("/login");
      return response;
    } catch (err) {
      console.log(err.response.data);
      if (err.response.data === "A user with that name already exists") {
        setUserEmailInput("");
        setEmailError("A user with that name already exists");

        return;
      }
      console.log("Oh no an error occured :(");
      console.log(err);
      return err;
    }
  };

  // const errorStyle = {
  //   fontSize: "2em",
  //   color: "red",
  // };

  //On load, redirect the user to their profile if they're already logged in
  useEffect(() => {
    if (user.loggedIn) {
      navigate("/profile");
    }
  }, [navigate, user.loggedIn]);

  useEffect(() => {
    const clearEmailError = () => {
      setEmailError(false);
      //change CSS back
    };

    const clearPasswordBError = () => {
      setPasswordBError(null);
      //change CSS back
    };

    const clearPasswordAError = () => {
      setPasswordAError(null);
      //change CSS back
    };

    if (passwordBError) {
      if (checkIfPasswordsMatch()) {
        clearPasswordBError();
      }
    }
    if (emailError) {
      if (validateEmail()) {
        clearEmailError();
      }
    }
    if (passwordAError) {
      if (checkIfPasswordMeetsRequirements()) {
        clearPasswordAError();
      }
    }
  }, [
    emailError,
    passwordBError,
    passwordAError,
    checkIfPasswordsMatch,
    validateEmail,
    checkIfPasswordMeetsRequirements,
  ]);

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
        <h2>Create a new account</h2>
        <div className="form">
          <div className="input-item">
            <label className="form-label" htmlFor="user-email">Email</label>
            <input
              className="form-control"
              onKeyUp={handleKeyPress}
              type="email"
              id="user-email"
              name="user-email"
              onChange={handleUserEmailChange}
            />
            {emailError && (
              <div className="input-error-box">
                <img alt="x" src={redX} />
                <p>{emailError}</p>
              </div>
            )}
          </div>
          <div className="input-item">
            <label className="form-label" htmlFor="first-name">First name</label>
            <input
              className="form-control"
              onKeyUp={handleKeyPress}
              type="text"
              id="first-name"
              name="first-name"
              onChange={handleFirstNameChange}
            />
            {firstNameError && (
              <div className="input-error-box">
                <img alt="x" src={redX} />
                <p>{firstNameError}</p>
              </div>
            )}
          </div>
          <div className="input-item">
            <label className="form-label" htmlFor="last-name">Last name</label>
            <input
              className="form-control"
              onKeyUp={handleKeyPress}
              type="text"
              id="last-name"
              name="last-name"
              onChange={handleLastNameChange}
            />
            {lastNameError && (
              <div className="input-error-box">
                <img alt="x" src={redX} />
                <p>{lastNameError}</p>
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
              onChange={handlePasswordAChange}
            />
            {passwordAError && (
              <div className="input-error-box">
                <img alt="x" src={redX} />
                <p>{passwordAError}</p>
              </div>
            )}
          </div>
          <div className="input-item">
            <label className="form-label" htmlFor="password-confirm">Confirm Password</label>
            <input
              className="form-control"
              onKeyUp={handleKeyPress}
              type="password"
              id="password-confirm"
              name="password-confirm"
              onChange={handlePasswordBChange}
            />
            {passwordBError && (
              <div className="input-error-box">
                <img alt="x" src={redX} />
                <p>{passwordBError}</p>
              </div>
            )}
          </div>
          <button
            className="important-button"
            type="submit"
            value="Submit"
            onClick={handleSubmit}
          >Submit</button>
        </div>
        <p className="form-page-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
