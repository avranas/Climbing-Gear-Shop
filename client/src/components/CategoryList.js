import { Link } from 'react-router-dom';
import shoesPic from '../images/shoes.png';
import harnessPic from '../images/harness.png';
import ropePic from '../images/rope.png';
import carabinerPic from '../images/carabiner.png';
import chalkPic from '../images/chalk.png';



const CategoryList = (props) => {

  const linkStyle = {
    color: 'black',
    textDecoration: 'none'
  };

  return (
    <div id="category-list" className="d-flex justify-content-around flex-wrap">
      <Link to="/products?category=shoes" style={linkStyle}>
        <div className="category-box">
          <img src={shoesPic} alt="shoes"/>
          <p>Shoes</p>
        </div>
      </Link>
      <Link to="/products?category=harnesses" style={linkStyle}>
        <div className="category-box">
          <img src={harnessPic} alt="harnesses" />
          <p>Harnesses</p>
        </div>
      </Link>
      <Link to="/products?category=ropes" style={linkStyle}>
        <div className="category-box">
          <img src={ropePic} alt="ropes"/>
          <p>Ropes</p>
        </div>
      </Link>
      <Link to="/products?category=hardware" style={linkStyle}>
        <div className="category-box">
          <img src={carabinerPic} alt="hardware"/>
          <p>Hardware</p>
        </div>
      </Link>
      <Link to="/products?category=chalk" style={linkStyle}>
        <div className="category-box">
          <img src={chalkPic} alt="chalk"/>
          <p>Chalk</p>
        </div>
      </Link>
    </div>
  );
};

export default CategoryList;

