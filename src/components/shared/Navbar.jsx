import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">
        {isAdmin ? 'Admin' : 'Dashboard'}
      </h1>
      <div>
        <Link 
          to={isAdmin ? '/' : '/admin'} 
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          {isAdmin ? 'Go to Dashboard' : 'Go to Admin'}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;