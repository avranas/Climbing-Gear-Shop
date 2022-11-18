import CategoryList from '../../components/CategoryList/CategoryList';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = (props) => {

  return (
    <main id="home-page">
      <div id="splash">
        <h1>Welcome to the Fake Climbing Gear Shop</h1>
      </div>
      <div id="shop-all-products-button-holder">
        <Link to="/products">
          <button className='important-button'>Shop all products</button>
        </Link>
      </div>
      <h2 className='container'>Shop By Category</h2>
      <CategoryList />
      <h2 className='container'>About Us</h2>
      <div className='container' id="about-us">
        <p>Fake Climbing Gear Shop is an e-commerce app made by <a href="https://github.com/avranas">
          Alex Vranas</a> to practice building full stack web apps. No climbing gear is actually being sold here,
          but you can expect this site to do everything that you expect an e-commerce site is capable of!</p>
       </div>
      <div id="footer-break">
      </div>
    </main>
  );
};

export default HomePage;
