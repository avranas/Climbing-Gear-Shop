import { Link } from "react-router-dom";
import "./ProductNavigationBar.css";

const ProductNavigationBar = (props) => {
  return (
    <section id="product-navigation-bar" className="container">
      <ul className="row">
        <li className="col-2">
          <Link to="/products">All Products</Link>
        </li>
        <li className="col-2">
          <Link to="/products?category=shoes">Shoes</Link>
        </li>
        <li className="col-2">
          <Link to="/products?category=harnesses">Harnesses</Link>
        </li>
        <li className="col-2">
          <Link to="/products?category=ropes">Ropes</Link>
        </li>
        <li className="col-2">
          <Link to="/products?category=hardware">Hardware</Link>
        </li>
        <li className="col-2">
          <Link to="/products?category=chalk">Chalk</Link>
        </li>
      </ul>
    </section>
  );
};

export default ProductNavigationBar;
