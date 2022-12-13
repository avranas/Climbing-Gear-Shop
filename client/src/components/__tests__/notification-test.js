import { cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import store from "../../store";
import Notification from "../Notification/Notification";

afterEach(() => {
  cleanup();
});

const notification = (
  <Provider store={store}>
    <BrowserRouter>
      <Notification />
    </BrowserRouter>
  </Provider>
);

test("Notification matches snapshot", async () => {
  const tree = renderer.create(notification).toJSON();
  expect(tree).toMatchSnapshot();
});