import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OrderSummary from "../../../components/OrderSummary/OrderSummary";
import { loadCartData, selectCart } from "../../../slices/cartSlice";
import "./Checkout.css";
import AddressForm from "../../../components/AddressForm/AddressForm";
import redX from "../../../images/red-x.png";

const Checkout = (props) => {
  const navigate = useNavigate();
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();

  const billingAddressRef = useRef();
  const shippingAddressRef = useRef();

  const [sameAsBillingChecked, setSameAsBillingChecked] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [disclaimerCheckedError, setDisclaimerCheckedError] = useState("");
  const [serverError, setServerError] = useState("");

  const normalizePhoneInput = (value) => {
    if (!value) {
      return value;
    }
    const currentValue = value.replace(/[^\d]/g, "");
    const length = currentValue.length;
    if (length > 10) {
      return currentValue;
    }
    if (length < 4) {
      return currentValue;
    }
    if (length < 7) {
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
    }
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(
      3,
      6
    )}-${currentValue.slice(6, 10)}`;
  };

  const handlePhoneNumberChange = (e) => {
    const newValue = normalizePhoneInput(e.target.value);
    setPhoneNumber(newValue);
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const response = await axios("/authenticated");
      if (response.data) {
      } else {
        //navigate('/login');
      }
      if (cart.itemCount === 0) {
        //navigate(-1);
      }
    };
    checkAuthentication();
    loadCartData(dispatch);
  }, [navigate, dispatch, cart.itemCount]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const toggleSameAsBillingChecked = (e) => {
    if (sameAsBillingChecked) {
      setSameAsBillingChecked(false);
    } else {
      setSameAsBillingChecked(true);
    }
  };

  const toggleDisclaimerChecked = (e) => {
    if (disclaimerChecked) {
      setDisclaimerChecked(false);
    } else {
      setDisclaimerChecked(true);
    }
  };

  //Raise a phone number error if there is one; clear it if there isn't
  //Return true if there's an error, return false if there isn't
  const checkPhoneNumberError = useCallback(() => {
    //Check for errors
    setPhoneNumberError("");
    if (phoneNumber === "") {
      setPhoneNumberError("This field is required.");
      return true;
    } else if (
      !phoneNumber.match(
        /^[\]?[(]?[0-9]{3}[)]?[-\s\]?[0-9]{3}[-\s\]?[0-9]{4,6}$/im
      )
    ) {
      setPhoneNumberError("Invalid phone number.");
      return true;
    }
    return false;
  }, [phoneNumber]);

  const checkDisclaimerCheckedError = useCallback(() => {
    setDisclaimerCheckedError("");
    if(disclaimerChecked === false) {
      setDisclaimerCheckedError("This box must be checked.");
      return true;
    }
    return false;
  }, [disclaimerChecked]);


  //Clear error messages as soon as they are fixed
  useEffect(() => {
    if (phoneNumberError) {
      checkPhoneNumberError();
    }
    if (disclaimerCheckedError) {
      checkDisclaimerCheckedError();
    }
  }, [phoneNumberError, checkPhoneNumberError, disclaimerCheckedError, checkDisclaimerCheckedError]);

  const handleSubmit = async (e) => {
    try {
      //All checks must be run to find and display all errors to the screen
      let errorFound = false;
      if (checkPhoneNumberError()) {
        errorFound = true;
      }
      if (checkDisclaimerCheckedError()) {
        errorFound = true;
      }
      if (billingAddressRef.current.checkForErrors()) {
        errorFound = true;
      }
      if (!sameAsBillingChecked) {
        if (shippingAddressRef.current.checkForErrors()) {
          errorFound = true;
        }
      }
      //If there is an error, exit the function here.
      if (errorFound) {
        console.log("error found :(");
        return;
      }
      console.log("yay no errors");
      const billingAddress = billingAddressRef.current.getAddressState();
      let shippingAddress = null;
      if (sameAsBillingChecked) {
        shippingAddress = billingAddress;
      } else {
        shippingAddress = shippingAddressRef.current.getAddressState();
      }

      //No need to send the cart information. That will already be stored in the
      //server. If I implement a guest checkout feature later, this will need
      //to be changed.

      const requestBody = {
        phoneNumber: phoneNumber,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
      };
      console.log(requestBody);

      //TODO: Allll right, all info from the customer has been collected,
      //hopefully without errors. Now I need to actually process the payment
      //And create a new order here.
      //How does Stripe work?

      const response = await axios.post("/checkout/create-checkout-session", requestBody);
      console.log("made it though the thing!");
      window.location.href = response.data.url;
      //Redirect to "Order placed! page on success"
    } catch (err) {
      if (err.response.status === 401) {
        setServerError("You are not logged in");
      } else {
        setServerError("Server error. Please double check the address");
      }
      console.log(err.message)
      console.log(err);
    }
  };

  return (
    <div id="checkout-page" className="container styled-box">
      <div id="checkout-head" className="row">
        <h2>Checkout</h2>
      </div>
      <div id="checkout-body" className="row">
        <div id="checkout-form" className="styled-box col-5">
          <h3>Contact Information</h3>
          <div className="input-item-incomplete-half">
            <label className="form-label" htmlFor="phone-number">
              Phone number
            </label>
            <input
              type="tel"
              id="phone-number"
              name="phone-number"
              className="form-control"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              onKeyUp={handleKeyPress}
            />
            {phoneNumberError && (
              <div className="input-error-box">
                <img alt="x" src={redX} />
                <p>{phoneNumberError}</p>
              </div>
            )}
          </div>
          <h3>Billing Address</h3>
          <AddressForm ref={billingAddressRef} hidden={false} />
          <h3>Shipping Address</h3>
          <div id="same-as-billing-input">
            <input
              id="same-as-billing"
              type="checkbox"
              checked={sameAsBillingChecked}
              onChange={toggleSameAsBillingChecked}
            />
            <label
              htmlFor="same-as-billing">
              Same as billing address
            </label>
          </div>
          <AddressForm ref={shippingAddressRef} hidden={sameAsBillingChecked} />
          <div id="disclaimer-input">
            <input
              id="disclaimer"
              type="checkbox"
              checked={disclaimerChecked}
              onChange={toggleDisclaimerChecked}
            />
            <label
              htmlFor="disclaimer">
              I understand that this is not a real store, and that I will not be recieving any of these items
            </label>
          </div>
          <div id="disclaimer-error">
            {disclaimerCheckedError && (
              <div className="input-error-box">
                <img alt="x" src={redX} />
                <p>{disclaimerCheckedError}</p>
              </div>
            )}
          </div>
          <div id="server-error">
            {serverError && (
              <div className="input-error-box">
                <img alt="x" src={redX} />
                <p>{serverError}</p>
              </div>
            )}
          </div>
          <div id="checkout-submit">
            <button
              className="important-button"
              type="submit"
              value="Submit"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
        <OrderSummary subTotal={cart.subTotal} />
      </div>
    </div>
  );
};

export default Checkout;


//TODO: Make disclaimer error disappear when box is checked
//  ^-- Do this next plsss 
