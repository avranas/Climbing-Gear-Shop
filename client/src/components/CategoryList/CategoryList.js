import { Link } from "react-router-dom";
import shoesPic from "../../images/shoes.png";
import harnessPic from "../../images/harness.png";
import ropePic from "../../images/rope.png";
import carabinerPic from "../../images/carabiner.png";
import chalkPic from "../../images/chalk.png";
import "./CategoryList.css";

const CategoryList = (props) => {
  const linkStyle = {
    color: "rgb(48, 53, 73)",
    textDecoration: "none",
  };

  return (
    <section
      id="category-list"
      className="container d-flex justify-content-around flex-wrap"
    >
      <Link to="/products/0?category=shoes" style={linkStyle}>
        <div className="category-box styled-box styled-link-box">
          <img src={shoesPic} alt="shoes" />
          <p>Shoes</p>
        </div>
      </Link>
      <Link to="/products/0?category=harnesses" style={linkStyle}>
        <div className="category-box styled-box styled-link-box">
          <img src={harnessPic} alt="harnesses" />
          <p>Harnesses</p>
        </div>
      </Link>
      <Link to="/products/0?category=ropes" style={linkStyle}>
        <div className="category-box styled-box styled-link-box">
          <img src={ropePic} alt="ropes" />
          <p>Ropes</p>
        </div>
      </Link>
      <Link to="/products/0?category=hardware" style={linkStyle}>
        <div className="category-box styled-box styled-link-box">
          <img src={carabinerPic} alt="hardware" />
          <p>Hardware</p>
        </div>
      </Link>
      <Link to="/products/0?category=chalk" style={linkStyle}>
        <div className="category-box styled-box styled-link-box">
          <img src={chalkPic} alt="chalk" />
          <p>Chalk</p>
        </div>
      </Link>
    </section>
  );
};

export default CategoryList;
