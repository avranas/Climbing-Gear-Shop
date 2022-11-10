import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { createNotification } from '../slices/notificationSlice';
import { useDispatch } from 'react-redux';

const Logout = (props) => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.get('/logout');
        dispatch({type: 'user/eraseUserData'});
        navigate('/login');
        createNotification(dispatch, "You are now logged out!");
      } catch (err) {
        console.log(err);
      }
    }
    logout();
  }, [dispatch, navigate]);

  return (
    <main className="container logout">
    </main>
  );
};

export default Logout;
