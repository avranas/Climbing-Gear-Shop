import { Link } from 'react-router-dom';

const SimpleHeader = (props) => {

  return (
    <header id="simple-header" className='container'>
      <Link to="/">
        <div className="logo" />
      </Link>
    </header>
  );
};

export default SimpleHeader;
