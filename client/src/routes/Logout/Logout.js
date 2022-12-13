import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { createNotification } from '../../slices/notificationSlice';
import { useDispatch } from 'react-redux';
import axios from "axios";

const Logout = (props) => {
  
  const dispatch = useDispatch();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.get('/logout');
        dispatch({type: 'user/eraseUserData'});
        createNotification(dispatch, "You are now logged out!");
      } catch (err) {
        console.log(err);
      }
    }
    logout();
  }, [dispatch]);

  return (
    <Navigate to="/login" />
  );
};

export default Logout;
