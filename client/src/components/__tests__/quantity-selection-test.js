import { cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import store from "../../store";
import Quantity from "../Quantity/Quantity";

afterEach(() => {
  cleanup();
});

const quantity = (
  <Provider store={store}>
    <BrowserRouter>
      <Quantity />
    </BrowserRouter>
  </Provider>
);

test("Quantity matches snapshot", async () => {
  const tree = renderer.create(quantity).toJSON();
  expect(tree).toMatchSnapshot();
});
