import redX from '../../images/red-x.png';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './FormPage.css';
import { createNotification } from '../../slices/notificationSlice';
import axios from 'axios';

const LoginPage = (props) => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ userEmailInput, setUserEmailInput ] = useState('');
  const [ passwordInput, setPasswordInput ] = useState('');
  const [ emailError, setEmailError ] = useState('');
  const [ passwordError, setPasswordError ] = useState('');
  const [ invalidLoginError, setInvalidLoginError ] = useState('');
  const handleUserEmailChange = (e) => {
    setUserEmailInput(e.target.value);
    setEmailError('');
  }

  const handlePasswordChange = (e) => {
    setPasswordInput(e.target.value);
    setPasswordError('');
  }

  const handleSubmit = async (e) => {
    try {
      let errorFound = false;
      if (userEmailInput === '') {
        setEmailError('This field is required');
        errorFound = true;
      }
      if (passwordInput === '') {
        setPasswordError('This field is required');
        errorFound = true;
      }
      if (errorFound) {
        return;
      }
      const requestBody = {
        userEmail: userEmailInput,
        password: passwordInput
      }
      await axios.post('/login', requestBody);
      //If the passwords don't match, an error will be thrown
      const userData = await axios.get('/user');
      dispatch({ type: 'user/loadUserData', payload: userData.data});
      navigate('/');
      createNotification(dispatch, "You are now logged in!");
      //If there are items in the guest's cart, move the data to
      //the server and clear it in localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart'));
      if (!guestCart) {
        return;
      }
      await axios.put('/cart/convert-guest-cart', guestCart);
      localStorage.removeItem('guestCart');
    } catch (err) {
      console.log(err)
      console.log(err.response.status)
      if (err.response.status === 401) {
        setInvalidLoginError('Email or password was incorrect!');
      }
      console.log(err);
    }
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios('/authenticated');
        if (response.data) {
         navigate('/profile'); 
        }
      } catch (err) {
        console.log(err);
      }
    }
    checkAuthentication();
  }, [navigate]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <main className="container form-page">
      <div className='form-header-wrap'>
        <h2>Login</h2>
        <div className="form">
          <label htmlFor="user-email">Email</label><br/>
          <input type="email" id="user-email" name="user-email" onChange={handleUserEmailChange} onKeyUp={handleKeyPress}/><br/>
          {
            emailError &&
            <div className='input-error-box'>
              <img alt="x" src={redX} />
              <p>{emailError}</p>
            </div>
          }
          <div className='form-break'></div>
          <label htmlFor="password">Password</label><br/>
          <input onKeyUp={handleKeyPress} type="password" id="password" name="password" onChange={handlePasswordChange}/>
          {
            passwordError &&
            <div className='input-error-box'>
              <img alt="x" src={redX} />
              <p>{passwordError}</p>
            </div>
          }
          <div className='form-break'></div>
          <input className="form-button "type="submit" value="Submit" onClick={handleSubmit}/>
          {
            invalidLoginError &&
            <div className='input-error-box'>
              <img alt="x" src={redX} />
              <p>{invalidLoginError}</p>
            </div>
          }
          <div className='form-break'></div>
          <div className='form-break'></div>
        </div>
        <p className="form-page-footer">Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </main>
  );
};

export default LoginPage;
