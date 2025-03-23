import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getUser } from '../../services/authService';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname === '/admin';
  const authenticated = isAuthenticated();
  const user = getUser();
  
  const handleLogout = () => {
    // Clear authentication state
    logout();
    
    // Always redirect to dashboard after logout
    navigate('/');
    
    // Force page refresh to ensure state is updated everywhere
    window.location.reload();
  };
  
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">
        {isAdmin ? 'Admin' : 'Dashboard'}
      </h1>
      <div className="flex items-center space-x-4">
        {authenticated && (
          <span className="text-sm text-gray-600">
            Logged in as <span className="font-medium">{user?.username}</span>
          </span>
        )}
        
        {authenticated ? (
          // User is logged in
          <>
            {isAdmin ? (
              <Link 
                to="/" 
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link 
                to="/admin" 
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Go to Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </>
        ) : (
          // User is not logged in - only show on dashboard
          !isAdmin && (
            <Link 
              to="/login" 
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Admin Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;