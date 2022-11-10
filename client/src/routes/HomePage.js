import CategoryList from '../components/CategoryList';
import { Link } from 'react-router-dom';

const HomePage = (props) => {

  return (
    <main id="home-page">
      <div id="splash">
        <h1>Welcome to the Fake Climbing Gear Shop</h1>
      </div>
      <h2>Shop by category</h2>
      <CategoryList />
      <Link to="/products">
        <button>Shop all products</button>
      </Link>
    </main>
  );
};

export default HomePage;
