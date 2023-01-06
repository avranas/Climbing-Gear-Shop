import { render, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import store from "../../store";
import ProductNavBar from "../ProductNavBar/ProductNavBar";

afterEach(() => {
  cleanup();
});

const productNavBar = (
  <Provider store={store}>
    <BrowserRouter>
      <ProductNavBar />
    </BrowserRouter>
  </Provider>
);

test("ProductNavBar matches snapshot", async () => {
  render(productNavBar);
  const tree = renderer.create(productNavBar).toJSON();
  expect(tree).toMatchSnapshot();
});
