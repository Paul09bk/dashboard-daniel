// web/src/components/shared/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return <Outlet />;
};

export default ProtectedRoute;