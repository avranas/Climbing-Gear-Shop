import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductNavigationBar from "../../components/ProductNavigationBar/ProductNavigationBar";
import {
  selectProductList,
  loadProductList,
} from "../../slices/productListSlice";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import "./ProductListPage.css";
import NavigationButtons from "../../components/NavigationButtons/NavigationButtons";
import LoadWheel from "../../components/LoadWheel/LoadWheel";

const ProductListPage = ({ category, search }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectProductList);
  const { page } = useParams();

  useEffect(() => {
    //load product list on page load
    dispatch(loadProductList({ category, search }));
  }, [dispatch, category, search]);

  const productsPerPage = 12;
  let firstProduct = 0;
  let lastProduct = productsPerPage;
  let prevDisabled = false;
  let nextDisabled = false;
  if (typeof Number(page) === "number") {
    firstProduct = Number(page) * productsPerPage;
    lastProduct = (Number(page) + 1) * productsPerPage;
  }
  if (lastProduct >= products.data.length) {
    nextDisabled = true;
  }
  if (page === "0") {
    prevDisabled = true;
  }
  let nextLink = `/products/${Number(page) + 1}`;
  let prevLink = `/products/${Number(page) - 1}`;
  if (category) {
    const addThis = `?category=${category}`;
    nextLink += addThis;
    prevLink += addThis;
  }
  if (search) {
    const addThis = `?search=${search}`;
    nextLink += addThis;
    prevLink += addThis;
  }

  return (
    <main id="product-list-page" className="container">
      <ProductNavigationBar />
      <div id="product-list-head">
        {category ? (
          <h2>{capitalizeFirstLetter(category)}</h2>
        ) : (
          <h2>All products</h2>
        )}
        {products.data.length === 1 ? (
          <p>{`(1 product)`}</p>
        ) : (
          <p>{`(${products.data.length} products)`}</p>
        )}
      </div>
      <div id="product-list-content">
        {products.isLoading ? (
          <LoadWheel />
        ) : products.data.length !== 0 ? (
          <ul>
            {" "}
            {products.data.slice(firstProduct, lastProduct).map((i, key) => {
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
            })}
          </ul>
        ) : (
          <p>No products found</p>
        )}
      </div>
      <NavigationButtons
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
        prevLink={prevLink}
        nextLink={nextLink}
      />
    </main>
  );
};

export default ProductListPage;

