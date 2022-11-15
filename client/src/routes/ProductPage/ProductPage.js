import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProduct, selectProduct } from "../../slices/productSlice";
import "./ProductPage.css";
import redX from "../../images/red-x.png";
import numberToUSD from "../../utils/numberToUSD";
import axios from "axios";
import ProductNavigationBar from "../../components/ProductNavigationBar/ProductNavigationBar";

//Props are productName, brandName, description, price, and imageURL,
const ProductPage = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [optionSelection, setOptionSelection] = useState("");
  const [quantitySelection, setQuantitySelection] = useState("1");
  const [missingSelectionError, setMissingSelectionError] = useState("");
  const [displayPrice, setDisplayPrice] = useState("");
  const [options, setOptions] = useState([]);
  const product = useSelector(selectProduct);

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
        optionSelection: optionSelection
      }
      //If the user is logged in, store cart data in the server,
      //Otherwise, store it in localStorage
      const loggedInCheck = await axios('/authenticated');
      //This will return true if the user is logged in
      if (loggedInCheck.data) {
        await axios.put('/cart', newCartItem);
      } else {
        dispatch({type: 'cart/addToGuestCart', payload: newCartItem});
      }
      dispatch({type: 'newestCartItem/setNewestCartItem', payload: newCartItem})
      navigate('/added-to-cart');
    } catch (err) {
      console.log('error')
      console.log(err)
    }
  };

  const handleOptionSlection = (e) => {
    const option = e.target.value;
    if (option === options[0]){
      setOptionSelection(options[0]);
    } else {
      const foundOption = product.productOptions.find(i => 
        i.option === option
      )
      setDisplayPrice(foundOption.price);
      setOptionSelection(option);
    }
  };

  const handleQuantitySlection = (e) => {
    setQuantitySelection(e.target.value);
  };

  useEffect(() => {
    //load product data on page load
    dispatch(loadProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    //Load options from productSlice, sort it, then display it on the page
    let newOptions = ["Select"];
    setOptionSelection(newOptions[0]);
    product.productOptions.map((i) => {
      return newOptions.push(i.option);
    });
    newOptions.sort((a, b) => a - b);
    setOptions(newOptions);
  }, [product.productOptions]);

  //Renders a page for one product
  return (
    <div id="product-page" className="container">
      <ProductNavigationBar/>
      {product.isLoading ? (
        <p>Loading...</p>
      ) : (
        <div id="product">
          <div id="product-image">
            <img
              alt="product"
              src={`http://localhost:3000/images/${product.smallImageFile1}`}
            />
          </div>
          <div id="product-info">
            <h3>{product.productName}</h3>
            <p>{product.brandName}</p>
            <p>{product.description}</p>
            <div id="price">
            {
              product.highestPrice === product.lowestPrice ?
                <p>{numberToUSD(product.lowestPrice)}</p>
              : optionSelection === options[0] ?
                <p>{`${numberToUSD(product.lowestPrice)} - ${numberToUSD(product.highestPrice)}`}</p>
              :
              <p>{numberToUSD(displayPrice)}</p>
            }
            </div>
            <div id="options">
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
              <div className="option-box">
                <label className="option-label" htmlFor="quantity">
                  Quantity{" "}
                </label>
                <br />
                <select
                  onChange={handleQuantitySlection}
                  name="quantity"
                  id="quantity"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                </select>
              </div>
            </div>
            {missingSelectionError && (
              <div className="input-error-box">
                <img alt="x" src={redX} />
                <p>{missingSelectionError}</p>
              </div>
            )}
            <button onClick={addToCart} className="important-button">
              Add to cart
            </button>
            <br/>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;


//TODO: Get amount in stock from the server and set a max option here
//Handle out of stock
//Adding an item to cart that is already in your cart, should ADD to the quantity,
//not replace it. Implement this after /cart is done so it'll be easier to test