import { Link } from "react-router-dom";
import "./NavButtons.css";

//Props are page,
const NavButtons = (props) => {
  return (
    <div id="directional-buttons">
      <div className="direction-button-container">
        {!props.prevDisabled ? (
          <Link to={props.prevLink}>
            <button id="prev-active" className="direction-button styled-box">
              Previous
            </button>
          </Link>
        ) : (
          <button
            disabled
            id="prev"
            className="direction-button direction-button-disabled styled-box"
          >
            Previous
          </button>
        )}
      </div>
      <div className="direction-button-container">
        {!props.nextDisabled ? (
          <Link to={props.nextLink}>
            <button className="direction-button styled-box" id="next-active">
              Next
            </button>
          </Link>
        ) : (
          <button
            disabled
            id="prev"
            className="direction-button direction-button-disabled styled-box"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default NavButtons;
