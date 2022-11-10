import { Link } from 'react-router-dom';
import SearchBar from './SearchBar/SearchBar';
import HeaderUserButtons from './HeaderUserButtons';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from "../slices/userSlice";
import { useEffect } from 'react';
import axios from '../api/api';

const DetailedHeader = (props) => {

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
    if (user.loggedIn) {
      getUserData();
    }
  });

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
        <div id="cart-icon" />
      </Link>
    </header>
  );
};

export default DetailedHeader;
