import "./ProductCard.css";
import { Link } from "react-router-dom";
import penniesToUSD from "../../utils/penniesToUSD";

//Renders a card for a single product
//Props are productName, brandName, description, price, and imageURL,
const ProductCard = (props) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  return (
    <li className="product-card styled-box styled-link-box">
      <Link to={`/product/${props.id}`}>
        <div className="product-image">
          <div className="top-image">
            <img
              alt="product"
              src={`${serverUrl}/images/${props.smallImageFile1}`}
            />
          </div>
          <div className="bottom-image">
            <img
              alt="product"
              src={`${serverUrl}/images/${props.smallImageFile2}`}
            />
          </div>
        </div>
        <div className="product-info">
          <h3>{props.brandName}</h3>
          <p>{props.productName}</p>

          {props.highestPrice === props.lowestPrice ? (
            <p>{penniesToUSD(props.lowestPrice)}</p>
          ) : (
            <p>{`${penniesToUSD(props.lowestPrice)} - ${penniesToUSD(
              props.highestPrice
            )}`}</p>
          )}
        </div>
      </Link>
    </li>
  );
};
export default ProductCard;
