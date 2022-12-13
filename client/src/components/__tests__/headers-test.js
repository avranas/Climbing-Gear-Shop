import { cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import store from "../../store";
import SimpleHeader from "../Headers/SimpleHeader";
import DetailedHeader from "../Headers/DetailedHeader";

afterEach(() => {
  cleanup();
});

const simpleHeader = (
  <Provider store={store}>
    <BrowserRouter>
      <SimpleHeader />
    </BrowserRouter>
  </Provider>
);

const detailedHeader = (
  <Provider store={store}>
    <BrowserRouter>
      <DetailedHeader />
    </BrowserRouter>
  </Provider>
);

test("SimpleHeader matches snapshot", async () => {
  const tree = renderer.create(simpleHeader).toJSON();
  expect(tree).toMatchSnapshot();
});

test("DetailedHeader matches snapshot", async () => {
  const tree = renderer.create(detailedHeader).toJSON();
  expect(tree).toMatchSnapshot();
});