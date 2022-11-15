import "./ProductCard.css";
import { Link } from "react-router-dom";
import numberToUSD from "../../utils/numberToUSD";
//Props are productName, brandName, description, price, and imageURL,
const ProductCard = (props) => {



  //Renders a card for a single product
  return (
    <div className="product-card">
      <Link to={`/product/${props.id}`}>
        <div className="product-image">
          <div className="top-image">
            <img
              alt="product"
              src={`http://localhost:3000/images/${props.smallImageFile1}`}
            />
          </div>
          <div className="bottom-image">
            <img
              alt="product"
              src={`http://localhost:3000/images/${props.smallImageFile2}`}
            />
          </div>
        </div>
        <div className="product-info">
          <h3>{props.brandName}</h3>
          <p>{props.productName}</p>
          
          {
            props.highestPrice === props.lowestPrice ?
            <p>{numberToUSD(props.lowestPrice)}</p>
            :
            <p>{`${numberToUSD(props.lowestPrice)} - ${numberToUSD(props.highestPrice)}`}</p>
          }
        </div>
      </Link>
    </div>
  );
};
export default ProductCard;
