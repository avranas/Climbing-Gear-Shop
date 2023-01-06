import { cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import store from "../../store";
import HeaderUserButtons from "../HeaderUserButtons/HeaderUserButtons";

afterEach(() => {
  cleanup();
});

const headerUserButtons = (
  <Provider store={store}>
    <BrowserRouter>
      <HeaderUserButtons />
    </BrowserRouter>
  </Provider>
);

test("HeaderUserButtons matches snapshot", async () => {
  const tree = renderer.create(headerUserButtons).toJSON();
  expect(tree).toMatchSnapshot();
});
