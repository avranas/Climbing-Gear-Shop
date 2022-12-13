import { cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import store from "../../store";
import CategoryList from "../CategoryList/CategoryList";

afterEach(() => {
  cleanup();
});

const categoryList = (
  <Provider store={store}>
    <BrowserRouter>
      <CategoryList />
    </BrowserRouter>
  </Provider>
);

test("CategoryList matches snapshot", async () => {
  const tree = renderer.create(categoryList).toJSON();
  expect(tree).toMatchSnapshot();
});
