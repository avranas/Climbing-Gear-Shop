import { render, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import store from "../../store";
import QuantitySelection from "../QuantitySelection/QuantitySelection";

afterEach(() => {
  cleanup();
});

const quantitySelection = (
  <Provider store={store}>
    <BrowserRouter>
      <QuantitySelection />
    </BrowserRouter>
  </Provider>
);

test("QuantitySelection matches snapshot", async () => {
  const tree = renderer.create(quantitySelection).toJSON();
  expect(tree).toMatchSnapshot();
});