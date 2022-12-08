import { Link } from 'react-router-dom';

const SimpleHeader = (props) => {

  return (
    <header className='header' id='simple-header-content'>
        <Link to="/">
          <div className="logo" />
        </Link>
    </header>
  );
};

export default SimpleHeader;
