import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const HeaderUserButtons = (props) => {

  const navigate = useNavigate();
  const [ userIsLoggedIn, setUserIsLoggedIn ] = useState(null);
  
  const handleLogout = async () => {
    navigate('/logout');
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios('/authenticated');
        setUserIsLoggedIn(response.data)
      } catch(err) {
        console.log(err)
      }
    }
    checkAuthentication();
  }, []);

  return (
    <div id="header-user-buttons">
      {
        userIsLoggedIn === null || userIsLoggedIn === false ?
      <div>
        <Link to="/login">
          <button id="left-button" type="button" className="btn btn-primary">Login</button>
        </Link>
        <span className="header-button-spacer"></span>
        <Link to="/register">
          <button type="button" className="btn btn-primary">Register</button>
        </Link>
      </div>
      :
      <div>
        <button onClick={handleLogout} type="button" className="btn btn-primary">Logout</button>
        <span className="header-button-spacer"></span>
        <Link to="/profile">
          <button type="button" className="btn btn-primary">Profile</button>
        </Link>
      </div>
      }
    </div>
  );
};

export default HeaderUserButtons;

