import "@testing-library/jest-dom";
import App from "./App";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store";
import renderer from "react-test-renderer";

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

test("renders learn react link", () => {
  const tree = renderer.create(app).toJSON();
  expect(tree).toMatchSnapshot();
});
