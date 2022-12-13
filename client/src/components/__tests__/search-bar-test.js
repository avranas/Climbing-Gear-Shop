import { render, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import store from "../../store";
import SearchBar from "../SearchBar/SearchBar";

afterEach(() => {
  cleanup();
});

const searchBar = (
  <Provider store={store}>
    <BrowserRouter>
      <SearchBar />
    </BrowserRouter>
  </Provider>
);

test("Searchbar matches snapshot", async () => {
  render(searchBar)
  const tree = renderer.create(searchBar).toJSON();
  expect(tree).toMatchSnapshot();
});