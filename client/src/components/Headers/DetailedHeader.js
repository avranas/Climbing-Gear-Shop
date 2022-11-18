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
        const authResponse = await axios.get('/authenticated');
        if (authResponse.data) {
          const response = await axios.get('/user');
          dispatch({type: 'user/loadUserData', payload: response.data});
        }
      } catch (err) {
        console.log(err);
      }
    }
    loadCartData(dispatch);
    getUserData();
  }, [dispatch]);

  return (
    <header className='header'>
      <div className="container" id='detailed-header-content'>
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
            cart.itemCount > 99 ?
            <div className="cart-items-count" id="double-digit">
              99+
            </div>
            : cart.itemCount > 9 ?
            <div className="cart-items-count" id="double-digit">
              {cart.itemCount}
            </div>
            : cart.itemCount !== 0 ?
            <div className="cart-items-count" id="single-digit">
              {cart.itemCount}
            </div>
            : null
          }
        </div>
      </Link>
      </div>
    </header>
  );
};

export default DetailedHeader;
