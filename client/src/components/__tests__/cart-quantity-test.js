import { cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import store from "../../store";
import CartQuantity from "../CartQuantity/CartQuantity";

afterEach(() => {
  cleanup();
});

const cartQuantity = (
  <Provider store={store}>
    <BrowserRouter>
      <CartQuantity />
    </BrowserRouter>
  </Provider>
);

test("CartQuantity matches snapshot", async () => {
  const tree = renderer.create(cartQuantity).toJSON();
  expect(tree).toMatchSnapshot();
});
