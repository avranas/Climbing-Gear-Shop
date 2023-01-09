import spinner from "../../images/load-wheel.png";
import "./LoadWheel.css";

const LoadWheel = (props) => {
  return (
    <div id="spinner-container">
      <div id="spinner">
        <img src={spinner} alt="load spinner" />
      </div>
    </div>
  );
};

export default LoadWheel;
