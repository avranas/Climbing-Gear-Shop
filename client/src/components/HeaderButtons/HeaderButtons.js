import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const HeaderButtons = (props) => {
  const navigate = useNavigate();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(null);

  const handleLogout = async () => {
    navigate("/logout");
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios("/authenticated");
        setUserIsLoggedIn(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    checkAuthentication();
  }, []);

  return (
    <div id="header-user-buttons">
      {userIsLoggedIn === null || userIsLoggedIn === false ? (
        <div>
          <Link to="/login">
            <button id="left-button" className="small-button">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button type="button" className="small-button">
              Register
            </button>
          </Link>
        </div>
      ) : (
        <div>
          <button onClick={handleLogout} className="small-button">
            Logout
          </button>

          <Link to="/orders/0">
            <button type="button" className="small-button">
              Orders
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HeaderButtons;
