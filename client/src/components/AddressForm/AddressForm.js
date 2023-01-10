import CountryDropdown from "../../components/Dropdown/CountryDropdown";
import StateDropdown from "../../components/Dropdown/StateDropdown";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import redX from "../../images/red-x.png";
import "./AddressForm.css";

const AddressForm = forwardRef((props, _ref) => {
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [streetAddress1, setStreetAddress1] = useState("");
  const [streetAddress2, setStreetAddress2] = useState("");
  const [streetAddressError, setStreetAddressError] = useState("");
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [zipCodeError, setZipCodeError] = useState("");
  const maxInput = 64;

  const countryRef = useRef();
  const stateRef = useRef();

  /*
    These functions check for errors in the form, and create error messages
    when errors are found. If an error is found, they return true. If not,
    they return false
  */
  const checkFirstNameError = useCallback(() => {
    setFirstNameError("");
    if (firstName === "") {
      setFirstNameError("This field is required.");
      return true;
    }
    return false;
  }, [firstName]);

  const checkLastNameError = useCallback(() => {
    setLastNameError("");
    if (lastName === "") {
      setLastNameError("This field is required.");
      return true;
    }
    return false;
  }, [lastName]);

  const checkStreetAddressError = useCallback(() => {
    setStreetAddressError("");
    if (streetAddress1 === "") {
      setStreetAddressError("This field is required.");
      return true;
    }
    return false;
  }, [streetAddress1]);

  const checkCityError = useCallback(() => {
    setCityError("");
    if (city === "") {
      setCityError("This field is required.");
      return true;
    }
    return false;
  }, [city]);

  const checkZipCodeError = useCallback(() => {
    setZipCodeError("");
    if (zipCode === "") {
      setZipCodeError("This field is required.");
      return true;
    } else if (!zipCode.match(/^\d{5}(?:[-\s]\d{4})?$/)) {
      setZipCodeError("Invalid Zip Code.");
      return true;
    }
    return false;
  }, [zipCode]);

  /*
    This function gets passes into StateDropdown and CountryDropdown.
    Whenever their state changes, useEffect gets called, which calls this
    function. When this function is called, errors get cleared if they no
    longer apply. We don't checkStateError() to be called without an error
    flagged, because It will flag an error with the default state (which is
    no selection)
  */
  const checkStateErrorIfErrorExists = () => {
    if (stateRef.current.hasError()) {
      return checkStateError();
    }
  };

  const checkStateError = () => {
    if (
      stateRef.current.getState() === "--" &&
      countryRef.current.getCountry() === "US"
    ) {
      stateRef.current.setError("This field is required.");
      return true;
    } else {
      stateRef.current.clearError();
    }
    return false;
  };

  useImperativeHandle(_ref, () => ({
    getAddressState: () => {
      return {
        country: countryRef.current.getCountry(),
        firstName: firstName,
        lastName: lastName,
        streetAddress1: streetAddress1,
        streetAddress2: streetAddress2,
        city: city,
        state: stateRef.current.getState(),
        zipCode: zipCode,
      };
    },
    checkForErrors: () => {
      let errorFound = false;
      if (checkFirstNameError()) {
        errorFound = true;
      }
      if (checkLastNameError()) {
        errorFound = true;
      }
      if (checkStreetAddressError()) {
        errorFound = true;
      }
      if (checkCityError()) {
        errorFound = true;
      }
      if (checkZipCodeError()) {
        errorFound = true;
      }
      if (checkStateError()) {
        errorFound = true;
      }
      return errorFound;
    },
  }));

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      props.handleSubmit();
    }
  };

  const handleFirstNameChange = (e) => {
    const newInput = e.target.value;
    if (newInput.length > maxInput) {
      return;
    }
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    const newInput = e.target.value;
    if (newInput.length > maxInput) {
      return;
    }
    setLastName(e.target.value);
  };

  const handleStreetAddress1Change = (e) => {
    const newInput = e.target.value;
    if (newInput.length > maxInput) {
      return;
    }
    setStreetAddress1(e.target.value);
  };

  const handleStreetAddress2Change = (e) => {
    const newInput = e.target.value;
    if (newInput.length > maxInput) {
      return;
    }
    setStreetAddress2(e.target.value);
  };

  const handleCityChange = (e) => {
    const newInput = e.target.value;
    if (newInput.length > maxInput) {
      return;
    }
    setCity(e.target.value);
  };

  const handleZipCodeChange = (e) => {
    const newInput = e.target.value;
    //According to Stack Overflow, the world's longest postal codes are 12 characters long
    if (newInput.length > 12) {
      return;
    }
    setZipCode(e.target.value);
  };

  const handleCountryChange = (newCountry) => {
    if (newCountry !== "United States") {
      stateRef.current.disable();
    } else {
      stateRef.current.enable();
    }
  };

  useEffect(() => {
    if (firstNameError) {
      checkFirstNameError();
    }
    if (lastNameError) {
      checkLastNameError();
    }
    if (streetAddressError) {
      checkStreetAddressError();
    }
    if (cityError) {
      checkCityError();
    }
    if (zipCodeError) {
      checkZipCodeError();
    }
  }, [
    firstNameError,
    lastNameError,
    streetAddressError,
    cityError,
    zipCodeError,
    checkFirstNameError,
    checkLastNameError,
    checkStreetAddressError,
    checkCityError,
    checkZipCodeError,
  ]);

  return props.hidden ? null : (
    <section className="address-form">
      <div className="input-item">
        <CountryDropdown
          handleChange={handleCountryChange}
          ref={countryRef}
          checkStateErrorIfErrorExists={checkStateErrorIfErrorExists}
        />
      </div>
      <div className="form-item-wrapper">
        <div className="input-item-half space-right">
          <label className="form-label" htmlFor="first-name">
            First name
          </label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            className="form-control"
            value={firstName}
            onChange={handleFirstNameChange}
            onKeyUp={handleKeyPress}
          />
          {firstNameError && (
            <div className="input-error-box">
              <img alt="error" src={redX} />
              <p>{firstNameError}</p>
            </div>
          )}
        </div>
        <div className="input-item-half">
          <label className="form-label" htmlFor="last-name">
            Last name
          </label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            className="form-control"
            value={lastName}
            onChange={handleLastNameChange}
            onKeyUp={handleKeyPress}
          />
          {lastNameError && (
            <div className="input-error-box">
              <img alt="error" src={redX} />
              <p>{lastNameError}</p>
            </div>
          )}
        </div>
      </div>
      <div className="input-item">
        <label className="form-label" htmlFor="street-address-1">
          Street Address
        </label>
        <input
          type="text"
          id="street-address-1"
          name="street-address-1"
          className="form-control"
          value={streetAddress1}
          onChange={handleStreetAddress1Change}
          onKeyUp={handleKeyPress}
        />
        <input
          type="text"
          id="street-address-2"
          name="street-address-2"
          className="form-control"
          placeholder="Apt., suite, unit, building, floor, etc."
          value={streetAddress2}
          onChange={handleStreetAddress2Change}
          onKeyUp={handleKeyPress}
        />
        {streetAddressError && (
          <div className="input-error-box">
            <img alt="error" src={redX} />
            <p>{streetAddressError}</p>
          </div>
        )}
      </div>
      <div className="form-item-wrapper">
        <div className="input-item-half space-right">
          <label className="form-label" htmlFor="city">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            className="form-control"
            value={city}
            onChange={handleCityChange}
            onKeyUp={handleKeyPress}
          />
          {cityError && (
            <div className="input-error-box">
              <img alt="error" src={redX} />
              <p>{cityError}</p>
            </div>
          )}
        </div>
        <div className="input-item-half">
          <StateDropdown
            ref={stateRef}
            checkStateErrorIfErrorExists={checkStateErrorIfErrorExists}
          />
        </div>
      </div>
      <div className="input-item-incomplete-half">
        <label className="form-label" htmlFor="zip-code">
          Postal Code
        </label>
        <input
          type="text"
          id="zip-code"
          name="zip-code"
          className="form-control"
          value={zipCode}
          onChange={handleZipCodeChange}
          onKeyUp={handleKeyPress}
        />
        {zipCodeError && (
          <div className="input-error-box">
            <img alt="error" src={redX} />
            <p>{zipCodeError}</p>
          </div>
        )}
      </div>
    </section>
  );
});

export default AddressForm;
