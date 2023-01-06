import { cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import store from "../../store";
import HeaderButtons from "../HeaderButtons/HeaderButtons";

afterEach(() => {
  cleanup();
});

const headerButtons = (
  <Provider store={store}>
    <BrowserRouter>
      <HeaderButtons />
    </BrowserRouter>
  </Provider>
);

test("HeaderUserButtons matches snapshot", async () => {
  const tree = renderer.create(headerButtons).toJSON();
  expect(tree).toMatchSnapshot();
});
 