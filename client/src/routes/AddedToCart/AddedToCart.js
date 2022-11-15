import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ProductNavigationBar from '../../components/ProductNavigationBar/ProductNavigationBar';
import { selectNewestCartItem } from '../../slices/newestCartItemSlice';
import { selectProduct } from '../../slices/productSlice';
import './AddedToCart.css';
const AddedToCart = (props) => {
  
  const navigate = useNavigate();
  const newestCartItem = useSelector(selectNewestCartItem);
  const product = useSelector(selectProduct);

  console.log(product)

  useEffect(() => {
    //This is the default value. If no newestCartItem is set, this will be true 
    if (newestCartItem.productId === 0) {
      navigate('/cart');
    }
  })

  return (
    <main className="container shaded-background" id="added-to-cart-page">
      <ProductNavigationBar />
      <div id="added-to-cart-head">
        <div id='green-checkmark'></div>
        <h2>Added to cart</h2>
      </div>
      <div id="added-to-cart-content">
        <div id="added-to-cart-image">
          <img
            alt="product"
            src={`http://localhost:3000/images/${product.smallImageFile1}`}
          />
        </div>
        <div id="added-to-cart-details">
          <p>{product.brandName}</p>
          <p>{product.productName}</p>
          <p>{`${product.optionType}: ${newestCartItem.optionSelection}`}</p>
          <p>{`Quantity: ${newestCartItem.quantity}`}</p>
          <div id="added-to-cart-buttons">
            <Link to={-1}>
              <button className="important-button">Continue shopping</button>
            </Link>
            <Link to ="/cart">
              <button className='semi-important-button'>Go to cart</button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddedToCart;
