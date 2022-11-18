import { Link } from 'react-router-dom';

const SimpleHeader = (props) => {

  return (
    <header className='header'>
      <div id='simple-header-content' className='container' >
        <Link to="/">
          <div className="logo" />
        </Link>
      </div>
    </header>
  );
};

export default SimpleHeader;
