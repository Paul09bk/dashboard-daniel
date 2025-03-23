// web/src/components/Admin/SensorDetail.jsx
import { useState, useEffect } from 'react';
import { fetchSensorWithMeasures, fetchSensorStats } from '../../services/apiService';

const SensorDetail = ({ sensorId, onBack }) => {
  const [sensor, setSensor] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const loadSensorData = async () => {
      if (!sensorId) return;
      
      try {
        setLoading(true);
        // Récupérer les détails du capteur et ses mesures
        const sensorData = await fetchSensorWithMeasures(sensorId);
        setSensor(sensorData);
        
        // Récupérer les statistiques du capteur
        const statsData = await fetchSensorStats(sensorId);
        setStats(statsData);
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des détails du capteur:', err);
        setError(`Impossible de charger les données: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadSensorData();
  }, [sensorId]);

  // Format des dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format des dates avec heure
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Non défini';
    try {
      return new Date(dateString).toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Traduire l'emplacement du capteur
  const translateLocation = (location) => {
    const locations = {
      'bedroom': 'Chambre',
      'livingroom': 'Salon',
      'bathroom': 'Salle de bain',
      'entrance': 'Entrée'
    };
    return locations[location] || location;
  };

  // Obtenir la couleur associée au type de mesure
  const getMeasureTypeColor = (type) => {
    const typeColors = {
      'temperature': 'bg-red-100 text-red-800',
      'humidity': 'bg-blue-100 text-blue-800',
      'airPollution': 'bg-purple-100 text-purple-800'
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  };

  // Obtenir l'unité associée au type de mesure
  const getMeasureUnit = (type) => {
    const typeUnits = {
      'temperature': '°C',
      'humidity': '%',
      'airPollution': 'AQI'
    };
    return typeUnits[type] || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-500">Chargement des détails...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-medium">Erreur</p>
        <p>{error}</p>
        <button 
          onClick={onBack}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Retour
        </button>
      </div>
    );
  }

  if (!sensor) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">Aucun capteur sélectionné</p>
        <button 
          onClick={onBack}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* En-tête avec retour */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-3 p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            Détails du capteur
          </h2>
        </div>
        <div className="text-sm bg-blue-50 py-1 px-3 rounded-full">
          <span className="font-medium text-blue-500">
            ID: {sensor._id}
          </span>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'info' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('info')}
          >
            Informations
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'measures' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('measures')}
          >
            Mesures ({sensor.measures?.length || 0})
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'stats' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            Statistiques
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="p-4">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Informations générales</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Emplacement dans le logement:</span>
                  <p className="font-medium">{translateLocation(sensor.location)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Date d'installation:</span>
                  <p className="font-medium">{formatDate(sensor.creationDate)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">ID de l'utilisateur:</span>
                  <p className="font-medium">{sensor.userID}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">État du capteur</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Nombre de mesures:</span>
                  <p className="font-medium">{sensor.measures?.length || 0}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Dernière activité:</span>
                  <p className="font-medium">
                    {sensor.measures && sensor.measures.length > 0 
                      ? formatDateTime(
                          sensor.measures.sort((a, b) => 
                            new Date(b.creationDate || b.timestamp) - new Date(a.creationDate || a.timestamp)
                          )[0].creationDate || sensor.measures[0].timestamp
                        )
                      : 'Aucune activité'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Statut:</span>
                  <p className="font-medium">
                    {sensor.measures && sensor.measures.length > 0 
                      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Actif
                        </span>
                      : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          En attente
                        </span>
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'measures' && (
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Historique des mesures</h3>
            
            {sensor.measures && sensor.measures.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valeur
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sensor.measures
                      .sort((a, b) => new Date(b.creationDate || b.timestamp) - new Date(a.creationDate || a.timestamp))
                      .map((measure, index) => (
                        <tr key={measure._id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(measure.creationDate || measure.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMeasureTypeColor(measure.type)}`}>
                              {measure.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {measure.value} {getMeasureUnit(measure.type)}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucune mesure enregistrée pour ce capteur
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Statistiques des mesures</h3>
            
            {stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm text-gray-500">Nombre de mesures</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-800">{stats.count}</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm text-gray-500">Valeur moyenne</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-800">
                    {stats.average ? stats.average.toFixed(1) : 'N/A'}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm text-gray-500">Valeur minimale</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-800">
                    {stats.min ?? 'N/A'}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm text-gray-500">Valeur maximale</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-800">
                    {stats.max ?? 'N/A'}
                  </div>
                </div>
                
                {stats.latest && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-500">Dernière mesure</div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-xs text-gray-500">Date</span>
                        <p className="font-medium">{formatDateTime(stats.latest.creationDate || stats.latest.timestamp)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Type</span>
                        <p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getMeasureTypeColor(stats.latest.type)}`}>
                            {stats.latest.type}
                          </span>
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Valeur</span>
                        <p className="font-medium">{stats.latest.value} {getMeasureUnit(stats.latest.type)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucune statistique disponible
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorDetail;