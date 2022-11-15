import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import HeaderUserButtons from '../HeaderUserButtons';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from "../../slices/userSlice";
import { useEffect } from 'react';
import axios from '../../api/api';
import './Header.css';
import { selectCart, loadCartData } from '../../slices/cartSlice';

const DetailedHeader = (props) => {

  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get('/user');
        dispatch({type: 'user/loadUserData', payload: response.data});
      } catch (err) {
        console.log(err);
      }
    }
    loadCartData(dispatch);
    getUserData();
  }, [dispatch]);
  const cartItemsCount = cart.cartItems.length

  return (
    <header className='container'>
      <Link to="/">
        <div className="logo" />
      </Link>
      <SearchBar />
      {
        user.loggedIn &&
        <p>{`Welcome, ${user.firstName}`}</p>
      }
      <HeaderUserButtons />
      <Link to='/cart'>
        <div id="cart-icon">
          {
            cartItemsCount > 9 ?
            <div className="cart-items-count" id="double-digit">
              {cartItemsCount}
            </div>
            : cartItemsCount !== 0 ?
            <div className="cart-items-count" id="single-digit">
              {cartItemsCount}
            </div>
            : null
          }
        </div>
      </Link>
    </header>
  );
};

export default DetailedHeader;
