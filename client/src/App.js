import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DetailedHeader from "./components/Headers/DetailedHeader";
import SimpleHeader from "./components/Headers/SimpleHeader";
import HomePage from "./routes/HomePage/HomePage";
import RegisterPage from "./routes/FormPage/RegisterPage";
import LoginPage from "./routes/FormPage/LoginPage";
import ProductListPage from "./routes/ProductListPage/ProductListPage";
import Notification from "./components/Notification/Notification";
import { useSelector } from "react-redux";
import { selectNotifications } from "./slices/notificationSlice";
import { Routes, Route, useSearchParams } from "react-router-dom";
import Logout from "./routes/Logout/Logout";
import ProductPage from "./routes/ProductPage/ProductPage";
import Cart from "./routes/CartPage/CartPage";
import Checkout from "./routes/FormPage/Checkout/Checkout";
import OrderPlaced from "./routes/OrderPlacedPage/OrderPlacedPage";
import OrdersList from "./routes/OrderListPage/OrderListPage";
import OrderDetailsPage from "./routes/OrderDetailsPage/OrderDetailsPage";
import SuccessfulLogin from "./routes/SuccessfulLogin/SuccessfulLogin";
import ProtectedRoutes from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  const [searchParams] = useSearchParams();
  const notifications = useSelector(selectNotifications);

  return (
    <div className="App">
      <Routes>
        {[
          "/",
          "/product",
          "/cart",
          "/orders/:page",
          "/products/:page",
          "/product/:id",
          "/added-to-cart",
          "/cart",
          "/order-placed",
          "/order/:id",
          "successful-login",
        ].map((path) => (
          <Route key={path} exact path={path} element={<DetailedHeader />} />
        ))}
        {["/checkout", "/register", "/login", "/logout"].map((path) => (
          <Route key={path} exact path={path} element={<SimpleHeader />} />
        ))}
      </Routes>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/login"
          element={
            <LoginPage
              next={searchParams.get("next")}
              error={searchParams.get("error")}
            />
          }
        />
        <Route
          path="/products/:page"
          element={
            <ProductListPage
              search={searchParams.get("search")}
              category={searchParams.get("category")}
            />
          }
        />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/orders/:page" element={<OrdersList />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-placed" element={<OrderPlaced />} />
          <Route path="/order/:id" element={<OrderDetailsPage />} />
          <Route path="/successful-login" element={<SuccessfulLogin />} />
        </Route>
      </Routes>
      {notifications.map((i, key) => (
        <Notification message={i.message} id={i.id} key={key} />
      ))}
      <footer>
        <div id="footer-spacer"></div>
        <p>
          Made with ❤️ by <a href="https://github.com/avranas">Alex Vranas</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
