import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProduct, selectProduct } from "../../slices/productSlice";
import './ProductPage.css'
import { numberToUSD } from "../../utils/numberToUSD";
import axios from "axios";
//Props are productName, brandName, description, price, and imageURL,
const ProductPage = (props) => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(selectProduct);
  const [sizeSelection, setSizeSelection] = useState('');
  const [quantitySelection, setQuantitySelection] = useState('');

  useEffect(() => {
    //load product data on page load
    dispatch(loadProduct(id));
  }, [dispatch, id]);

  const addToCart = async () => {
    try {
      // const body = {
      //   sizeSelection: sizeSelection,

      // }
      // const response = await axios('/cart', )
    } catch (err) {
      
    }
  }

  const handleSizeSlection = (e) => {
    setSizeSelection(e.target.value);
  }

  const handleQuantitySlection = (e) => {
    setQuantitySelection(e.target.value);
  }

  //Renders a page for one product
  return (
    <div id="product-page" className="container">
      {product.isLoading ? (
        <p>Loading...</p>
      ) : (
        <div id="product" className="row">
          <div className="col" id="product-image">
            <img
              alt="product"
              src={`http://localhost:3000/images/${product.largeImageFile}`}
            />
          </div>
          <div className="col" id="product-info">
            <h3>{product.productName}</h3>
            <p>{product.brandName}</p>
            <p>{product.description}</p>
            <p>{numberToUSD(product.price)}</p>
            <div id="options">
              <div className="option-box">
                <label className="option-label" htmlFor="size">Size</label><br/>
                <select onChange={handleSizeSlection} name="size" id="size" >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div className="option-box">
                <label className="option-label" htmlFor="quantity">Quantity </label><br/>
                <select onChange={handleQuantitySlection} name="quantity" id="quantity">
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
            <button onClick={addToCart} id="submit">Add to cart</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;

//TODO: Add a back button
//Add to cart button
//Quantity select
//Option select
  //Dropdown menu with options depending on the category
    //For shoes: 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14
    //For harnesses: S, M, L
    //For everything else: No option to change option, gets saved as "Default"
    //Option selection gets saved in a string, and stored as TEXT in the backend

