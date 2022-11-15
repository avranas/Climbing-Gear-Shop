import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductNavigationBar from "../../components/ProductNavigationBar/ProductNavigationBar";
import {
  selectProductList,
  loadProductList,
} from "../../slices/productListSlice";
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter'
import "./ProductListPage.css";

const ProductListPage = ({ category }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectProductList);

  useEffect(() => {
    //load product list on page load
    dispatch(loadProductList(category));
  }, [dispatch, category]);


  return (
    <main id="product-list-page" className="container">
    <ProductNavigationBar/>
      <div id="product-list-head">
      {
        category ?
          <h2>{capitalizeFirstLetter(category)}</h2>
        :
          <h2>All products</h2>
      }
      {
        products.listOfProducts.length === 1 ?
        <p>{`(1 product)`}</p>
        :
        <p>{`(${products.listOfProducts.length} products)`}</p>
      }
      </div>
      <div className="d-flex flex-wrap">
      {
        products.isLoading ?
        <p>Loading...</p>
      :
      products.listOfProducts.length !== 0 ? (
        products.listOfProducts.map((i, key) => {
          return (
            <ProductCard
              id={i.id}
              key={key}
              productName={i.productName}
              brandName={i.brandName}
              description={i.description}
              highestPrice={i.highestPrice}
              lowestPrice={i.lowestPrice}
              smallImageFile1={i.smallImageFile1}
              smallImageFile2={i.smallImageFile2}
            />
          );
        })
      ) : (
        <p>No products found</p>
      )}
      </div>
    </main>
  );
};

export default ProductListPage;
