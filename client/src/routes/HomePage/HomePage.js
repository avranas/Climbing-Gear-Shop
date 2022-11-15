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
      <h2 className='container'>Shop by category</h2>
      <CategoryList />
      <div id="footer-break">
      </div>
    </main>
  );
};

export default HomePage;
