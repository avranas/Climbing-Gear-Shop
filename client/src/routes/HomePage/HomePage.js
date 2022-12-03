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
        <Link to="/products/0">
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
        <p>This site uses Stripe for payments which is currently set to test mode. If you would like to see
          how payments are processed, enter the credit card number: "4242 4242 4242 4242" with fake data for 
          everything else</p>
       </div>
      <div id="footer-break">
      </div>
    </main>
  );
};

export default HomePage;
