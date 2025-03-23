// web/src/components/shared/Layout.jsx
import { Outlet } from 'react-router-dom';
// Navbar n'est plus importée
import Sidebar from '../dashboard/Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar a été retirée d'ici */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;