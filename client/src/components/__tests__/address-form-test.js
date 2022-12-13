import { cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import store from "../../store";
import AddressForm from "../AddressForm/AddressForm";

afterEach(() => {
  cleanup();
});

const addressForm = (
  <Provider store={store}>
    <BrowserRouter>
      <AddressForm />
    </BrowserRouter>
  </Provider>
);

test("AddressForm matches snapshot", async () => {
  const tree = renderer.create(addressForm).toJSON();
  expect(tree).toMatchSnapshot();
});
