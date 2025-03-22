import { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import Map from '../components/dashboard/Map';
// import Charts from '../components/dashboard/Charts';
import UsersList from '../components/dashboard/UsersList';
import MeasuresList from '../components/dashboard/MeasuresList';
// import { fetchDashboardData } from '../services/api';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    capteurs: 500,
    utilisateurs: 300,
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
        // Uncomment this when your API is ready
        // const data = await fetchDashboardData();
        // setDashboardData(data);
        
        // For now, we'll use mock data
        setTimeout(() => {
          setDashboardData({
            capteurs: 500,
            utilisateurs: 300,
            date: new Date().toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard data...</div>;
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
          <Map />
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <UsersList />
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* <Charts /> */}
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <MeasuresList />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;