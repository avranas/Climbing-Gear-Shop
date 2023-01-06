import { render, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import store from "../../store";
import ProductNavigationBar from "../ProductNavigationBar/ProductNavigationBar";

afterEach(() => {
  cleanup();
});

const productNavigationBar = (
  <Provider store={store}>
    <BrowserRouter>
      <ProductNavigationBar />
    </BrowserRouter>
  </Provider>
);

test("ProductNavigationBar matches snapshot", async () => {
  render(productNavigationBar);
  const tree = renderer.create(productNavigationBar).toJSON();
  expect(tree).toMatchSnapshot();
});
