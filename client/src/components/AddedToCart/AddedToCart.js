import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectNewestCartItem } from "../../slices/newestCartItemSlice";
import { selectProduct } from "../../slices/productSlice";
import "./AddedToCart.css";
const AddedToCart = (props) => {
  const newestCartItem = useSelector(selectNewestCartItem);
  const productData = useSelector(selectProduct).data;
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  
  return (
    <main className="container">
      <div data-overlay className="overlay"></div>
      <div id="added-to-cart-page">
        <div id="added-to-cart-head">
          <div id="green-checkmark"></div>
          <h2>Added to cart</h2>
        </div>
        <div id="added-to-cart-content">
          <div id="added-to-cart-image">
            <img
              alt="product"
              src={`
                ${serverUrl}/images/${productData.smallImageFile1}
              `}
            />
          </div>
          <div id="added-to-cart-details">
            <p>{productData.brandName}</p>
            <p>{productData.productName}</p>
            <p>
              {`${productData.optionType}: ${newestCartItem.optionSelection}`}
            </p>
            <p>{`Quantity: ${newestCartItem.quantity}`}</p>
            <div id="added-to-cart-buttons">
              <div id="button-container">
                <button
                  onClick={props.closeWindow}
                  className="important-button"
                >
                  Continue shopping
                </button>
              </div>
              <div id="button-container">
                <Link to="/cart">
                  <button className="semi-important-button">Go to cart</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddedToCart;
