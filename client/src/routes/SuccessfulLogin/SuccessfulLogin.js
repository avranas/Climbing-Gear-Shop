import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loadCartData,
  moveGuestCartItemsToUserCart,
} from "../../slices/cartSlice";
import { createNotification } from "../../slices/notificationSlice";

/*
  After a successful OAuth login, the user gets redirected to a 
  Route to this Page. All this done is create a "You have been
  logged in" notificiation and redirects the user to the home page"
*/
const SuccessfulLogin = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [actionsComplete, setSctionsComplete] = useState(false);

  useEffect(() => {
    const doAsyncTasks = async () => {
      if (!actionsComplete) {
        await moveGuestCartItemsToUserCart();
        loadCartData(dispatch);
        createNotification(dispatch, "You are now logged in");
        navigate("/");
        setSctionsComplete(true);
      }
    };
    doAsyncTasks();
  }, [navigate, dispatch, actionsComplete]);
  return null;
};

export default SuccessfulLogin;
