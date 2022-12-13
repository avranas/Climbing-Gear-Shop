import { cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import store from "../../store";
import CartQuantitySelection from "../CartQuantitySelection/CartQuantitySelection";

afterEach(() => {
  cleanup();
});

const cartQuantitySelection = (
  <Provider store={store}>
    <BrowserRouter>
      <CartQuantitySelection />
    </BrowserRouter>
  </Provider>
);

test("CartQuantitySelection matches snapshot", async () => {
  const tree = renderer.create(cartQuantitySelection).toJSON();
  expect(tree).toMatchSnapshot();
});

