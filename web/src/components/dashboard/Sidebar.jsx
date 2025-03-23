import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getUser } from '../../services/authService';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const authenticated = isAuthenticated();
  const user = getUser();
  
  // Menu items - dynamique selon l'état d'authentification
  const menuItems = [
    { icon: "📊", label: "Dashboard", path: "/" }
  ];
  
  // Ajouter Admin uniquement si l'utilisateur est authentifié
  if (authenticated) {
    menuItems.push({ icon: "🔧", label: "Admin", path: "/admin" });
  }
  
  const handleLogout = () => {
    // Déconnexion
    logout();
    
    // Redirection vers le dashboard
    navigate('/');
    
    // Force page refresh pour mettre à jour l'état partout
    window.location.reload();
  };

  return (
    <div 
      className={`bg-gray-800 h-full flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'w-48' : 'w-16'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center justify-center py-6">
        <span className="text-white text-xl font-bold">D</span>
      </div>
      
      {/* User info section */}
      {authenticated && (
        <div className={`px-3 py-2 border-b border-gray-700 text-gray-300 text-xs ${isExpanded ? 'block' : 'hidden'}`}>
          <div className="opacity-70">Logged in as:</div>
          <div className="font-medium truncate">{user?.username}</div>
        </div>
      )}
      
      {/* Menu items */}
      <div className="flex flex-col space-y-4 px-3 mt-6">
        {menuItems.map((item, index) => {
          const isActive = 
            (item.path === '/' && location.pathname === '/') || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
            
          return (
            <Link 
              key={index} 
              to={item.path}
              className={`flex items-center rounded-lg overflow-hidden group transition-all duration-200 
                ${isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'}`}
            >
              <div className="min-w-[40px] h-10 flex items-center justify-center">
                <span>{item.icon}</span>
              </div>
              <span 
                className={`whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {/* Login ou Logout button */}
        {authenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center rounded-lg overflow-hidden group transition-all duration-200 text-gray-300 hover:bg-red-700"
          >
            <div className="min-w-[40px] h-10 flex items-center justify-center">
              <span>🚪</span>
            </div>
            <span 
              className={`whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
            >
              Logout
            </span>
          </button>
        ) : (
          <Link
            to="/login"
            className="flex items-center rounded-lg overflow-hidden group transition-all duration-200 text-gray-300 hover:bg-gray-700"
          >
            <div className="min-w-[40px] h-10 flex items-center justify-center">
              <span>🔑</span>
            </div>
            <span 
              className={`whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
            >
              Admin Login
            </span>
          </Link>
        )}
      </div>
      
      {/* Version info at bottom */}
      <div className="mt-auto px-3 py-2 text-gray-500 text-xs">
        <div className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          v1.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;