import { render, screen, cleanup, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import ProductPage from "../../routes/ProductPage/ProductPage";
import store from "../../store";

afterEach(() => {
  cleanup();
});

const productPage = (
  <Provider store={store}>
    <BrowserRouter>
      <ProductPage />
    </BrowserRouter>
  </Provider>
);

test("should render product page", () => {
  // render(productPage);
   const productPageElement = screen.getByTestId("product-page");
   expect(productPageElement).toBeInTheDocument();
});


// test("Snapshot matches after user clicks 'add to cart'", async () => {
//   render(productPage)
//   console.log(productPage)
//   const button = await screen.findByTestId("add-to-cart-button");
//   userEvent.click(button);
//   //console.log(productPage)
//   //const tree = renderer.create(productPage).toJSON();
//   expect(tree).toMatchSnapshot();
// });

//TODO: LEARN HOW API MOCKING WORKS