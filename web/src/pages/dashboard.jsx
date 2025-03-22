import { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import UsersList from '../components/dashboard/UsersList';
import MeasuresList from '../components/dashboard/MeasuresList';
import MapWidget from '../components/MapWidget/MapWidget';
import { fetchDashboardStats } from '../services/apiService';

const DashboardPage = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    capteurs: 0,
    utilisateurs: 0,
    date: new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Récupérer les statistiques réelles
        const stats = await fetchDashboardStats();
        setDashboardData(stats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // En cas d'erreur, utiliser des valeurs par défaut
        setDashboardData({
          capteurs: '?',
          utilisateurs: '?',
          date: new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des données...</p>
      </div>
    </div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">{dashboardData.date}</p>
        </div>
        <div className="flex space-x-4">
          <StatCard title="Capteurs" value={dashboardData.capteurs} />
          <StatCard title="Utilisateurs" value={dashboardData.utilisateurs} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <MapWidget />
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <UsersList onUserSelect={handleUserSelect} />
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* <Charts /> */}
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <MeasuresList selectedUserId={selectedUserId} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;