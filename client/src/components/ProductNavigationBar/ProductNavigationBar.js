import { Link } from "react-router-dom";
import "./ProductNavigationBar.css";

const ProductNavigationBar = (props) => {
  return (
    <section id="product-navigation-bar" className="container styled-box">
      <ul className="row">
        <li className="col-2">
          <Link to="/products/0">All Products</Link>
        </li>
        <li className="col-2">
          <Link to="/products/0?category=shoes">Shoes</Link>
        </li>
        <li className="col-2">
          <Link to="/products/0?category=harnesses">Harnesses</Link>
        </li>
        <li className="col-2">
          <Link to="/products/0?category=ropes">Ropes</Link>
        </li>
        <li className="col-2">
          <Link to="/products/0?category=hardware">Hardware</Link>
        </li>
        <li className="col-2">
          <Link to="/products/0?category=chalk">Chalk</Link>
        </li>
      </ul>
    </section>
  );
};

export default ProductNavigationBar;
