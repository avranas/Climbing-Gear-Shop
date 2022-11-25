import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProduct, selectProduct } from "../../slices/productSlice";
import "./ProductPage.css";
import redX from "../../images/red-x.png";
import penniesToUSD from "../../utils/penniesToUSD";
import axios from "axios";
import ProductNavigationBar from "../../components/ProductNavigationBar/ProductNavigationBar";
import AddedToCartWindow from "../AddedToCartWindow/AddedToCartWindow";
import { loadCartData } from "../../slices/cartSlice";
import QuantitySelection from "../../components/QuantitySelection/QuantitySelection";
import { v4 as uuidv4 } from "uuid";

//Props are productName, brandName, description, price, and imageURL,
const ProductPage = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [optionSelection, setOptionSelection] = useState("");
  const [quantitySelection, setQuantitySelection] = useState("1");
  const [missingSelectionError, setMissingSelectionError] = useState("");
  const [displayPrice, setDisplayPrice] = useState("");
  const [currentAmountInStock, setCurrentAmountInStock] = useState(-1);
  const [outOfStockError, setOutOfStockError] = useState("");
  const [options, setOptions] = useState([]);
  const product = useSelector(selectProduct);
  const [addedToCartWindowOpen, setAddedToCartWindowOpen] = useState(false);

  const addToCart = async () => {
    //options[0] is 'Select'
    if (optionSelection === options[0]) {
      setMissingSelectionError("A selection is required");
      return;
    } else {
      setMissingSelectionError("");
    }
    try {
      const newCartItem = {
        quantity: quantitySelection,
        productId: product.id,
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
      loadCartData(dispatch);
      setAddedToCartWindowOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  const closeWindow = () => {
    setAddedToCartWindowOpen(false);
  };

  const handleOptionSlection = (e) => {
    setOptionSelection(e.target.value);
  }

  //Update product information when optionSelection changes
  useEffect(() => {
    const foundOption = product.productOptions.find(
      (i) => i.option === optionSelection
    );
    //This will happen when the page is loading
    if (!foundOption) {
      return;
    }
    setDisplayPrice(foundOption.price);
    setCurrentAmountInStock(foundOption.amountInStock);
    if (foundOption.amountInStock === 0) {
      setOutOfStockError("This selection is out of stock");
    } else {
      setOutOfStockError("");
    }
  }, [optionSelection, setOutOfStockError, product.productOptions]);

  const handleQuantitySelection = (e) => {
    setQuantitySelection(e.target.value);
  };

  useEffect(() => {
    //load product data on page load
    dispatch(loadProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    //Load options from productSlice, sort it, then display it on the page
    let newOptions = ["Select"];
    product.productOptions.map((i) => {
      return newOptions.push(i.option);
    });
    newOptions.sort((a, b) => a - b);
    if(product.productOptions.length === 1) {
      setOptionSelection(newOptions[1]);
    } else {
      setOptionSelection(newOptions[0]);
    }
    setOptions(newOptions);
  }, [product.productOptions]);

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
    <div id="product-page" className="container">
      <ProductNavigationBar />
      {addedToCartWindowOpen && (
        <div>
          <AddedToCartWindow closeWindow={closeWindow} />
        </div>
      )}
      {product.isLoading ? (
        <p>Loading...</p>
      ) : (
        <div id="product"
        className="styled-box row">
          <div id="product-image" className="col-4">
            <img
              alt="product"
              src={`${process.env.REACT_APP_SERVER_URL}/images/${product.largeImageFile}`}
            />
          </div>
          <div className="col-1"></div>
          <div id="product-info" className="col-6">
            <h3>{product.productName}</h3>
            <p>{product.brandName}</p>
            <p>{product.description}</p>
            <div id="price">
              {product.highestPrice === product.lowestPrice ? (
                <p>{penniesToUSD(product.lowestPrice)}</p>
              ) : optionSelection === options[0] ? (
                <p>{`${penniesToUSD(product.lowestPrice)} - ${penniesToUSD(
                  product.highestPrice
                )}`}</p>
              ) : (
                <p>{penniesToUSD(displayPrice)}</p>
              )}
            </div>
              <div id="options">
              {
                product.productOptions.length > 1 &&
                <div className="option-box">
                  <label className="option-label" htmlFor={product.optionType}>
                    {product.optionType}
                  </label>
                  <br />
                  <select
                    onChange={handleOptionSlection}
                    name="option"
                    id="option"
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
                    amountInStock={currentAmountInStock}
                    handleSelection={handleQuantitySelection}
                    defaultOption={"1"}
                  />
                </div>
              </div>
            {missingSelectionError && (
              <div className="input-error-box">
                <img alt="x" src={redX} />
                <p>{missingSelectionError}</p>
              </div>
            )}
            {outOfStockError && (
              <div className="input-error-box">
                <img alt="x" src={redX} />
                <p>{outOfStockError}</p>
              </div>
            )}
            <button onClick={addToCart} className="important-button">
              Add to cart
            </button>
            <br />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
