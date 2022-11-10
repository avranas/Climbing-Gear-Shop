import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard/ProductCard";
import {
  selectProductList,
  loadProductList,
} from "../../slices/productListSlice";
import "./ProductListPage.css";

const ProductListPage = ({ category }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectProductList);

  useEffect(() => {
    //load product list on page load
    dispatch(loadProductList(category));
  }, [dispatch, category]);

  return (
    <main id="product-list-page" className="container d-flex flex-wrap">
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
              price={i.price}
              smallImageFile1={i.smallImageFile1}
              smallImageFile2={i.smallImageFile2}
            />
          );
        })
      ) : (
        <p>No products found</p>
      )}
    </main>
  );
};

export default ProductListPage;
