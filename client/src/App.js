import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import DetailedHeader from './components/Headers/DetailedHeader';
import SimpleHeader from'./components/Headers/SimpleHeader';
import HomePage from './routes/HomePage/HomePage';
import RegisterPage from './routes/FormPage/RegisterPage';
import LoginPage from './routes/FormPage/LoginPage';
import ProductListPage from './routes/ProductListPage/ProductListPage';
import Notification from './components/Notification/Notification';
import { useSelector } from 'react-redux';
import { selectNotifications } from './slices/notificationSlice';
import {
  Routes,
  Route,
  useSearchParams
} from "react-router-dom";
import Logout from './routes/Logout/Logout';
import ProductPage from './routes/ProductPage/ProductPage';
import Cart from './routes/Cart/Cart';
import Checkout from './routes/FormPage/Checkout/Checkout';
import OrderPlaced from './routes/OrderPlaced/OrderPlaced';
import OrdersList from './routes/OrderListPage/OrderListPage';
import OrderDetailsPage from './routes/OrderDetailsPage/OrderDetailsPage';

function App() {

  const [searchParams] = useSearchParams();
  const notifications = useSelector(selectNotifications);
  
  return (
    <div className="App">
      <Routes>
        <Route
          path='/'
          element={<DetailedHeader />}
        />
        <Route
          path='/product'
          element={<DetailedHeader />}
        />
        <Route
          path='/cart'
          element={<DetailedHeader />}
        />
        <Route
          path='/orders/:page'
          element={<DetailedHeader />}
        />
        <Route
          path='/products/:page'
          element={<DetailedHeader />}
        />
        <Route
          path='/product/:id'
          element={<DetailedHeader />}
        />
        <Route
          path="/added-to-cart"
          element={<DetailedHeader/>}
        />
        <Route
          path="/cart"
          element={<DetailedHeader/>}
        />
        <Route
          path='/order-placed'
          element={<DetailedHeader />}
        />
        <Route
          path='/order/:id'
          element={<DetailedHeader />}
        />
        <Route
          path="/checkout"
          element={<SimpleHeader/>}
        />
        <Route
          path='/register'
          element={<SimpleHeader />}
        />
        <Route
          path='/login'
          element={<SimpleHeader />}
        />
        <Route
          path='/logout'
          element={<SimpleHeader />}
        />
      </Routes>

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/register"  
          element={<RegisterPage />}
        />
        <Route
          path="/login"
          element={<LoginPage next={searchParams.get("next")} />}
        />
        <Route
          path="/logout"
          element={<Logout />}
        />
        <Route
          path="/orders/:page"
          element={<OrdersList />}
        />
        <Route
          path="/products/:page"
          element={<ProductListPage search={searchParams.get("search")} category={searchParams.get("category")}/>}
        />
        <Route
          path="/product/:id"
          element={<ProductPage/>}
        />
        <Route
          path="/checkout"
          element={<Checkout/>}
        />
        <Route
          path="/cart"
          element={<Cart/>}
        />
        <Route
          path='/order-placed'
          element={<OrderPlaced />}
        />
        <Route
          path='/order/:id'
          element={<OrderDetailsPage />}
        />
      </Routes>
      {
        notifications.map((i, key) => <Notification message={i.message} id={i.id} key={key}/>)
      }
      <footer>
        <p>
          Made with ❤️ by <a href="https://github.com/avranas">Alex Vranas</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
