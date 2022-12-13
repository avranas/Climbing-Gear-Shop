import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProduct, selectProduct } from "../../slices/productSlice";
import "./ProductPage.css";
import redX from "../../images/red-x.png";
import warning from "../../images/warning.png";
import penniesToUSD from "../../utils/penniesToUSD";
import axios from "axios";
import ProductNavigationBar from "../../components/ProductNavigationBar/ProductNavigationBar";
import AddedToCartWindow from "../../components/AddedToCartWindow/AddedToCartWindow";
import { loadCartData } from "../../slices/cartSlice";
import QuantitySelection from "../../components/QuantitySelection/QuantitySelection";
import { v4 as uuidv4 } from "uuid";
import LoadWheel from "../../components/LoadWheel/LoadWheel";

//Props are productName, brandName, description, price, and imageURL,
const ProductPage = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [optionSelection, setOptionSelection] = useState("");
  const [missingSelectionError, setMissingSelectionError] = useState("");
  const [displayPrice, setDisplayPrice] = useState("");
  const [currentAmountInStock, setCurrentAmountInStock] = useState(-1);
  const [outOfStockError, setOutOfStockError] = useState("");
  const [lowOnStockWarning, setLowOnStockWarning] = useState("");
  const [options, setOptions] = useState([]);
  const product = useSelector(selectProduct);
  const productData = product.data;
  const [addedToCartWindowOpen, setAddedToCartWindowOpen] = useState(false);
  const [quantityDisabled, setQuantityDisabled] = useState(true);
  const quantitySelectRef = useRef();


  const addToCart = async () => {
    //options[0] is 'Select'
    if (optionSelection === options[0]) {
      setMissingSelectionError("A selection is required");
      return;
    } else {
      setMissingSelectionError("");
    }
    if (currentAmountInStock === 0) {
      return;
    }

    try {
      const newCartItem = {
        quantity: quantitySelectRef.current.getSelection(),
        productId: productData.id,
        optionSelection: optionSelection,
      };
      //If the user is logged in, store cart data in the server,
      //Otherwise, store it in localStorage
      const loggedInCheck = await axios("/authenticated");
      //This will return true if the user is logged in
      if (loggedInCheck.data) {
        //Add to cart in server
        const response = await axios.post("/cart", newCartItem);
        console.log(response);
        if (response.data === "Not enough in stock. Setting to the max.") {
          setOutOfStockError(response.data);
          loadCartData(dispatch);
          return;
        }
      } else {
        //Add new item to the guest cart in localStorage
        newCartItem.id = uuidv4();
        //localStorage can only accept strings, so I have to use this workaround
        //where I save stringified arrays, then retrieve the strings, and parse
        //them into JSON
        let guestCart = JSON.parse(localStorage.getItem("guestCart"));
        if (!guestCart) {
          const newArray = [];
          newArray.push(newCartItem);
          localStorage.setItem("guestCart", JSON.stringify(newArray));
        } else {
          //If this item is already in the cart, update it with a newer quantity
          //instead of adding it to the cart
          let itemAlreadyInCart = false;
          let outOfStockErrorFound = false;
          guestCart.forEach((i) => {
            if (
              i.productId === newCartItem.productId &&
              i.optionSelection === newCartItem.optionSelection
            ) {
              itemAlreadyInCart = true;
              i.quantity = (
                Number(newCartItem.quantity) + Number(i.quantity)
              ).toString();
              //If too many items are added, set quantity to amountInStock then display an error message
              if (i.quantity > currentAmountInStock) {
                i.quantity = currentAmountInStock;
                outOfStockErrorFound = true;
              }
            }
          });
          if (!itemAlreadyInCart) {
            guestCart.push(newCartItem);
          }
          localStorage.setItem("guestCart", JSON.stringify(guestCart));
          if (outOfStockErrorFound) {
            setOutOfStockError("Not enough in stock. Setting to the max.");
            loadCartData(dispatch);
            return;
          }
        }
      }
      dispatch({
        type: "newestCartItem/setNewestCartItem",
        payload: newCartItem,
      });
      setAddedToCartWindowOpen(true);
      loadCartData(dispatch);
      window.scrollTo(0, 0);
    } catch (err) {
      console.log(err);
    }
  };

  const closeWindow = () => {
    setAddedToCartWindowOpen(false);
  };

  const handleOptionSlection = (e) => {
    setOptionSelection(e.target.value);
    if (e.target.value === options[0]) {
      setQuantityDisabled(true)
      setOutOfStockError("");
      setLowOnStockWarning("");
    } else {
      setQuantityDisabled(false);
    }
  }

  //Update product information when optionSelection changes
  useEffect(() => {
    const foundOption = productData.productOptions.find(
      (i) => i.option === optionSelection
    );
    //This will happen when the page is loading
    if (!foundOption) {
      return;
    }
    const newAmountInStock = foundOption.amountInStock;
    setDisplayPrice(foundOption.price);
    setCurrentAmountInStock(newAmountInStock);
    if (newAmountInStock === 0) {
      setOutOfStockError("This selection is out of stock");
      setQuantityDisabled(true);
      setLowOnStockWarning("");
    } else if (newAmountInStock === 1) {
      setLowOnStockWarning(`There is only ${newAmountInStock} left in stock! Buy now!`)
      setOutOfStockError("");
    } else if (newAmountInStock <= 5) {
      setLowOnStockWarning(`There are only ${newAmountInStock} of these in stock! Buy now!`)
      setOutOfStockError("");
    } else {
      setOutOfStockError("");
      setQuantityDisabled(false);
      setLowOnStockWarning("");
    }
    //Erase missing selection error if there is one
    setMissingSelectionError("");
  }, [optionSelection, setOutOfStockError, productData.productOptions]);

  useEffect(() => {
    //load product data on page load
    dispatch(loadProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    //Load options from productSlice, sort it, then display it on the page
    let newOptions = [];
    productData.productOptions.map((i) => {
      return newOptions.push(i.option);
    });
    //Sort options. They will want to be sorted differently based on its option type
    //Always sort numerically if the options are numbers
    if (!isNaN(newOptions[0])) {
      newOptions.sort((a, b) => a - b);
    } else {
      switch (productData.optionType) {
        //Sort these reverse-alphabetically
        case 'Size':
          newOptions.sort((a, b) => b.localeCompare(a))
          break;
        //Sort these alphabetically
        case 'Length':
        default:
          newOptions.sort((a, b) => a.localeCompare(b))
          break;
      }
    }
    newOptions.unshift("Select");
    setQuantityDisabled(true);
    if(productData.productOptions.length === 1) {
      setOptionSelection(newOptions[1]);
      setQuantityDisabled(false);
    } else {
      setOptionSelection(newOptions[0]);
    }
    setOptions(newOptions);
  }, [productData.productOptions, productData.optionType]);

  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.matches("[data-overlay]")) {
        setAddedToCartWindowOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [addedToCartWindowOpen]);

  //Renders a page for one product
  return (
    <main id="product-page" className="container" data-testid="product-page">
      <ProductNavigationBar />
      {addedToCartWindowOpen && (
        <div>
          <AddedToCartWindow closeWindow={closeWindow} />
        </div>
      )}
      {
        !product ? (
        <h2>404 Error - Product ID not found</h2>)
      : product.isLoading ? (
        <LoadWheel />
      ) : (
        <div id="product"
        className="styled-box">
          <section id="product-image">
            <img
              alt="product"
              src={`${process.env.REACT_APP_SERVER_URL}/images/${productData.largeImageFile}`}
            />
          </section>
          <div id="product-page-spacer"></div>
          <section id="product-info">
            <h3>{productData.productName}</h3>
            <p>{productData.brandName}</p>
            <p>{productData.description}</p>
            <div id="price">
              {productData.highestPrice === productData.lowestPrice ? (
                <p>{penniesToUSD(productData.lowestPrice)}</p>
              ) : optionSelection === options[0] ? (
                <p>{`${penniesToUSD(productData.lowestPrice)} - ${penniesToUSD(
                  productData.highestPrice
                )}`}</p>
              ) : (
                <p>{penniesToUSD(displayPrice)}</p>
              )}
            </div>
              <div id="options">
              {
                productData.productOptions.length > 1 &&
                <div className="option-box">
                  <label className="option-label" htmlFor={productData.optionType}>
                    {productData.optionType}
                  </label>
                  <br />
                  <select className="form-select form-select-sm"
                    onChange={handleOptionSlection}
                    name="option"
                    id="option-select"
                  >
                    {options.map((i, key) => {
                      return (
                        <option key={key} value={`${i}`}>
                          {i}
                        </option>
                      );
                    })}
                  </select>
                </div>
              }
                <div className="option-box">
                  <label className="option-label" htmlFor="quantity">
                    Quantity{" "}
                  </label>
                  <br />
                  <QuantitySelection
                    ref={quantitySelectRef}
                    amountInStock={currentAmountInStock}
                    disabled={quantityDisabled}
                  />
                </div>
              </div>
            {lowOnStockWarning && (
              <div className="input-warning-box">
                <img alt="warning" src={warning} />
                <p>{lowOnStockWarning}</p>
              </div>
            )}
            {missingSelectionError && (
              <div className="input-error-box">
                <img alt="error" src={redX} />
                <p>{missingSelectionError}</p>
              </div>
            )}
            {outOfStockError && (
              <div className="input-error-box">
                <img alt="error" src={redX} />
                <p>{outOfStockError}</p>
              </div>
            )}
            <div id="product-footer">
              <button data-testid="add-to-cart-button" onClick={addToCart} className="important-button">
                Add to cart
              </button>
            </div>
            <br />
          </section>
        </div>
      )}
    </main>
  );
};

export default ProductPage;
