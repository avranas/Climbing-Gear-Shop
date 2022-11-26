import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import HeaderUserButtons from '../HeaderUserButtons/HeaderUserButtons';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from "../../slices/userSlice";
import { useEffect, useState } from 'react';
import './Header.css';
import { selectCart, loadCartData } from '../../slices/cartSlice';
import axios from 'axios';

const DetailedHeader = (props) => {

  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState(false);
  const user = useSelector(selectUser)

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios("/authenticated");
        if (response.data) {
          const response = await axios.get('/user');
          setLoggedIn(true);
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
        loggedIn &&
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
