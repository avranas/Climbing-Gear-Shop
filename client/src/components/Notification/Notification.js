import { useDispatch } from "react-redux";
import "./Notification.css";
const Notification = (props) => {
  const dispatch = useDispatch();

  const clearNotification = () => {
    dispatch({
      type: "notifications/endNotification",
      payload: { id: props.id },
    });
  };

  return (
    <div className="notification-container">
      <div onClick={clearNotification} className="notification-content">
        <div className="notification-icon"></div>
        <p>{props.message}</p>
      </div>
    </div>
  );
};

export default Notification;
