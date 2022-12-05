import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNotification } from "../slices/notificationSlice";

//After a successful OAuth login, the user gets redirected to a 
//Route to this Page. All this done is create a "You have been
//logged in" notificiation and redirects the user to the home page"
const SuccessfulLogin = (props) => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notificationSent, selectNotificationSent] = useState(false);


  useEffect(() => {
    if(!notificationSent) {
      createNotification(dispatch, "You are now logged in");
      selectNotificationSent(true);
    }
    navigate("/")
  }, [navigate, dispatch, notificationSent])
  
  return (
    <div></div>
  );
}

export default SuccessfulLogin;