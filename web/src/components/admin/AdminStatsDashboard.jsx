// web/src/components/Admin/AdminStatsDashboard.jsx
import { useState, useEffect } from 'react';
import { fetchEntities } from '../../services/apiService';

const AdminStatsDashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 0, loading: true, error: null },
    sensors: { total: 0, byLocation: {}, loading: true, error: null },
    measures: { total: 0, byType: {}, loading: true, error: null },
  });

  useEffect(() => {
    const loadStats = async () => {
      // Charger les utilisateurs
      try {
        const users = await fetchEntities('users');
        setStats(prevStats => ({
          ...prevStats,
          users: {
            total: users.length,
            byLocation: users.reduce((acc, user) => {
              const location = user.location || 'Non défini';
              acc[location] = (acc[location] || 0) + 1;
              return acc;
            }, {}),
            loading: false,
            error: null
          }
        }));
      } catch (error) {
        setStats(prevStats => ({
          ...prevStats,
          users: {
            ...prevStats.users,
            loading: false,
            error: error.message
          }
        }));
      }

      // Charger les capteurs
      try {
        const sensors = await fetchEntities('sensors');
        setStats(prevStats => ({
          ...prevStats,
          sensors: {
            total: sensors.length,
            byLocation: sensors.reduce((acc, sensor) => {
              const location = sensor.location || 'Non défini';
              acc[location] = (acc[location] || 0) + 1;
              return acc;
            }, {}),
            loading: false,
            error: null
          }
        }));
      } catch (error) {
        setStats(prevStats => ({
          ...prevStats,
          sensors: {
            ...prevStats.sensors,
            loading: false,
            error: error.message
          }
        }));
      }

      // Charger les mesures
      try {
        const measures = await fetchEntities('measures');
        setStats(prevStats => ({
          ...prevStats,
          measures: {
            total: measures.length,
            byType: measures.reduce((acc, measure) => {
              const type = measure.type || 'Non défini';
              acc[type] = (acc[type] || 0) + 1;
              return acc;
            }, {}),
            loading: false,
            error: null
          }
        }));
      } catch (error) {
        setStats(prevStats => ({
          ...prevStats,
          measures: {
            ...prevStats.measures,
            loading: false,
            error: error.message
          }
        }));
      }
    };

    loadStats();
  }, []);

  const getStatusIndicator = (statSection) => {
    if (statSection.loading) {
      return (
        <div className="animate-pulse w-3 h-3 rounded-full bg-yellow-400 ml-2" title="Chargement..."></div>
      );
    } else if (statSection.error) {
      return (
        <div className="w-3 h-3 rounded-full bg-red-500 ml-2" title={statSection.error}></div>
      );
    }
    return (
      <div className="w-3 h-3 rounded-full bg-green-500 ml-2" title="Données chargées"></div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Utilisateurs */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-800">Utilisateurs</h3>
          {getStatusIndicator(stats.users)}
        </div>
        
        {stats.users.loading ? (
          <div className="animate-pulse h-24 bg-blue-200 rounded"></div>
        ) : stats.users.error ? (
          <div className="text-red-500 text-sm">{stats.users.error}</div>
        ) : (
          <div>
            <div className="text-3xl font-bold text-blue-700 mb-2">{stats.users.total}</div>
            
            <h4 className="text-sm font-medium text-blue-600 mt-4 mb-2">Par pays</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {Object.entries(stats.users.byLocation || {}).sort((a, b) => b[1] - a[1]).map(([location, count]) => (
                <div key={location} className="flex justify-between text-sm">
                  <span className="text-blue-800 capitalize">{location}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Capteurs */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-green-800">Capteurs</h3>
          {getStatusIndicator(stats.sensors)}
        </div>
        
        {stats.sensors.loading ? (
          <div className="animate-pulse h-24 bg-green-200 rounded"></div>
        ) : stats.sensors.error ? (
          <div className="text-red-500 text-sm">{stats.sensors.error}</div>
        ) : (
          <div>
            <div className="text-3xl font-bold text-green-700 mb-2">{stats.sensors.total}</div>
            
            <h4 className="text-sm font-medium text-green-600 mt-4 mb-2">Par emplacement</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {Object.entries(stats.sensors.byLocation || {}).sort((a, b) => b[1] - a[1]).map(([location, count]) => (
                <div key={location} className="flex justify-between text-sm">
                  <span className="text-green-800">{location === 'bedroom' ? 'Chambre' : 
                                                    location === 'livingroom' ? 'Salon' : 
                                                    location === 'bathroom' ? 'Salle de bain' : 
                                                    location === 'entrance' ? 'Entrée' : location}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mesures */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-purple-800">Mesures</h3>
          {getStatusIndicator(stats.measures)}
        </div>
        
        {stats.measures.loading ? (
          <div className="animate-pulse h-24 bg-purple-200 rounded"></div>
        ) : stats.measures.error ? (
          <div className="text-red-500 text-sm">{stats.measures.error}</div>
        ) : (
          <div>
            <div className="text-3xl font-bold text-purple-700 mb-2">{stats.measures.total}</div>
            
            <h4 className="text-sm font-medium text-purple-600 mt-4 mb-2">Par type</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {Object.entries(stats.measures.byType || {}).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="text-purple-800">{type === 'temperature' ? 'Température' : 
                                                   type === 'humidity' ? 'Humidité' : 
                                                   type === 'airPollution' ? 'Pollution de l\'air' : type}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatsDashboard;