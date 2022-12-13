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

//TODO AFTER WRITING TESTS: Go through every single file in this project, starting with the front end.
//Format
//Go through each line, fix every issue you can find
//Remove unneccessary comments, add new comments
//Trim lines of code that are too long
//Format again

//Front end formatted; next do back end