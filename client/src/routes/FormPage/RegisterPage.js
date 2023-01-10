import { useCallback, useEffect, useState } from "react";
import redX from "../../images/red-x.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FormPage.css";
import { useDispatch } from "react-redux";
import { createNotification } from "../../slices/notificationSlice";

const RegisterPage = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userEmailInput, setUserEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [passwordInputA, setPasswordInputA] = useState("");
  const [passwordInputB, setPasswordInputB] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [passwordAError, setPasswordAError] = useState(null);
  const [passwordBError, setPasswordBError] = useState(null);
  const maxInput = 64;

  const handleUserEmailChange = (e) => {
    const newInput = e.target.value;
    if (newInput.length > maxInput) {
      return;
    }
    setUserEmailInput(newInput);
  };

  const handleNameChange = (e) => {
    const newInput = e.target.value;
    if (newInput.length > maxInput) {
      return;
    }
    setNameInput(newInput);
    setNameError(null);
  };

  const handlePasswordAChange = (e) => {
    const newInput = e.target.value;
    if (newInput.length > maxInput) {
      return;
    }
    setPasswordInputA(newInput);
  };

  const handlePasswordBChange = (e) => {
    const newInput = e.target.value;
    if (newInput.length > maxInput) {
      return;
    }
    setPasswordInputB(newInput);
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
          `Password must have at least 6 characters, 1 number, 1 letter, ` +
            `and 1 special character`
        );
        errorFound = true;
      }
      if (!checkIfPasswordsMatch()) {
        setPasswordBError("Both passwords must match");
        errorFound = true;
      }
      if (!nameInput) {
        setNameError("This field is required");
        errorFound = true;
      }
      if (errorFound) {
        return;
      }
      const requestBody = {
        userEmail: userEmailInput,
        name: nameInput,
        password: passwordInputA,
      };

      const response = await axios.post("/server-register", requestBody);
      //Create notification for successful registration
      createNotification(dispatch, "Account successfully created!");

      navigate("/login");
      return response;
    } catch (err) {
      console.log(err.response.data);
      if (err.response.data === "A user with that email already exists") {
        setUserEmailInput("");
        setEmailError("A user with that email already exists");

        return;
      }
      console.log(err);
      return err;
    }
  };

  //On load, redirect the user to their profile if they're already logged in
  useEffect(() => {
    const getAuthData = async () => {
      const response = await axios.get("/authenticated");
      if (response.data) {
        navigate(-1);
      }
    };
    getAuthData();
  }, [navigate]);

  useEffect(() => {
    const clearEmailError = () => {
      setEmailError(false);
    };

    const clearPasswordBError = () => {
      setPasswordBError(null);
    };

    const clearPasswordAError = () => {
      setPasswordAError(null);
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
            <label className="form-label" htmlFor="user-email">
              Email
            </label>
            <input
              className="form-control"
              onKeyUp={handleKeyPress}
              value={userEmailInput}
              type="email"
              id="user-email"
              name="user-email"
              onChange={handleUserEmailChange}
            />
            {emailError && (
              <div className="input-error-box">
                <img alt="error" src={redX} />
                <p>{emailError}</p>
              </div>
            )}
          </div>
          <div className="input-item">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              className="form-control"
              onKeyUp={handleKeyPress}
              value={nameInput}
              type="text"
              id="name"
              name="name"
              onChange={handleNameChange}
            />
            {nameError && (
              <div className="input-error-box">
                <img alt="error" src={redX} />
                <p>{nameError}</p>
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
              value={passwordInputA}
              type="password"
              id="password"
              name="password"
              onChange={handlePasswordAChange}
            />
            {passwordAError && (
              <div className="input-error-box">
                <img alt="error" src={redX} />
                <p>{passwordAError}</p>
              </div>
            )}
          </div>
          <div className="input-item">
            <label className="form-label" htmlFor="password-confirm">
              Confirm Password
            </label>
            <input
              className="form-control"
              onKeyUp={handleKeyPress}
              value={passwordInputB}
              type="password"
              id="password-confirm"
              name="password-confirm"
              onChange={handlePasswordBChange}
            />
            {passwordBError && (
              <div className="input-error-box">
                <img alt="error" src={redX} />
                <p>{passwordBError}</p>
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
        </div>
        <p className="form-page-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
