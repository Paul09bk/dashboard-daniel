import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const menuItems = [
    { icon: "📊", label: "Dashboard", path: "/" },
    { icon: "🔧", label: "Admin", path: "/admin" }
  ];

  return (
    <div 
      className={`bg-gray-800 h-full flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'w-48' : 'w-16'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center justify-center py-6">
        <span className="text-white text-xl font-bold">D</span>
      </div>
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
      </div>
    </div>
  );
};

export default Sidebar;