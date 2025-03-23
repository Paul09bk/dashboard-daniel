// web/src/components/admin/DataRelationships.jsx
import { useState, useEffect } from 'react';
import { fetchEntities } from '../../services/apiService';

const DataRelationships = () => {
  const [data, setData] = useState({
    users: [],
    sensors: [],
    measures: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger toutes les données en parallèle
        const [users, sensors, measures] = await Promise.all([
          fetchEntities('users'),
          fetchEntities('sensors'),
          fetchEntities('measures')
        ]);

        setData({
          users,
          sensors,
          measures
        });
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(`Impossible de charger les données: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Obtenir les capteurs associés à un utilisateur
  const getUserSensors = (userId) => {
    if (!userId || !data.sensors) return [];
    
    return data.sensors.filter(sensor => {
      const sensorUserId = sensor.userID || sensor.userId;
      return sensorUserId === userId;
    });
  };

  // Obtenir les mesures associées à un capteur
  const getSensorMeasures = (sensorId) => {
    if (!sensorId || !data.measures) return [];
    
    return data.measures.filter(measure => {
      const measureSensorId = measure.sensorID || measure.sensorId || '';
      return measureSensorId === sensorId;
    });
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Traduire la taille de maison
  const translateHouseSize = (size) => {
    const sizes = {
      'small': 'Petite',
      'medium': 'Moyenne',
      'big': 'Grande'
    };
    return sizes[size] || size;
  };

  // Traduire le type de mesure
  const translateMeasureType = (type) => {
    const types = {
      'temperature': 'Température',
      'humidity': 'Humidité',
      'airPollution': 'Pollution de l\'air'
    };
    return types[type] || type;
  };

  // Obtenir l'unité pour un type de mesure
  const getMeasureUnit = (type) => {
    const units = {
      'temperature': '°C',
      'humidity': '%',
      'airPollution': 'AQI'
    };
    return units[type] || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-500">Chargement des données relationnelles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-medium">Erreur</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium text-gray-800 mb-4">
        Relations entre les données
      </h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Sélectionnez un utilisateur pour voir ses capteurs et mesures associés.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Liste des utilisateurs */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-blue-700 mb-3">
            Utilisateurs ({data.users.length})
          </h3>
          
          <div className="max-h-96 overflow-y-auto">
            {data.users.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Aucun utilisateur trouvé</p>
            ) : (
              <ul className="space-y-2">
                {data.users.map(user => (
                  <li 
                    key={user._id} 
                    className={`border p-2 rounded cursor-pointer transition-colors ${
                      selectedUser && selectedUser._id === user._id
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium capitalize">{user.location}</span>
                      <span className="text-sm text-gray-500">{user._id.substring(0, 6)}...</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {user.personsInHouse} personne(s) - {translateHouseSize(user.houseSize)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getUserSensors(user._id).length} capteur(s) associé(s)
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Liste des capteurs de l'utilisateur sélectionné */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-green-700 mb-3">
            Capteurs {selectedUser ? `de ${selectedUser.location}` : ''}
          </h3>
          
          {!selectedUser ? (
            <p className="text-center text-gray-500 py-4">Sélectionnez un utilisateur pour voir ses capteurs</p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {getUserSensors(selectedUser._id).length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  <p>Aucun capteur associé</p>
                  <p className="text-xs mt-2">Pour ajouter un capteur, allez dans l'onglet "Capteurs"</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {getUserSensors(selectedUser._id).map(sensor => (
                    <li key={sensor._id} className="border p-2 rounded hover:bg-gray-50">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {sensor.type || 'Type inconnu'}
                        </span>
                        <span className="text-sm text-gray-500">{sensor._id.substring(0, 6)}...</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {sensor.location || 'Emplacement inconnu'} - {sensor.model || 'Modèle inconnu'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getSensorMeasures(sensor._id).length} mesure(s) - 
                        Installé le {formatDate(sensor.creationDate).split(' à')[0]}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        
        {/* Résumé des mesures pour l'utilisateur sélectionné */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-purple-700 mb-3">
            Mesures récentes {selectedUser ? `pour ${selectedUser.location}` : ''}
          </h3>
          
          {!selectedUser ? (
            <p className="text-center text-gray-500 py-4">Sélectionnez un utilisateur pour voir les mesures</p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {getUserSensors(selectedUser._id).length === 0 ? (
                <p className="text-center text-gray-500 py-4">Aucun capteur associé</p>
              ) : (
                <div>
                  {getUserSensors(selectedUser._id).map(sensor => {
                    const sensorMeasures = getSensorMeasures(sensor._id);
                    
                    if (sensorMeasures.length === 0) {
                      return (
                        <div key={sensor._id} className="mb-4 border-b pb-2">
                          <p className="font-medium">{sensor.type || 'Type inconnu'} - {sensor.location}</p>
                          <p className="text-sm text-gray-500">Aucune mesure enregistrée</p>
                        </div>
                      );
                    }
                    
                    // Trier les mesures par date (plus récentes d'abord)
                    const sortedMeasures = [...sensorMeasures].sort((a, b) => 
                      new Date(b.creationDate || b.timestamp || 0) - 
                      new Date(a.creationDate || a.timestamp || 0)
                    );
                    
                    // Afficher seulement les 3 plus récentes
                    const recentMeasures = sortedMeasures.slice(0, 3);
                    
                    return (
                      <div key={sensor._id} className="mb-4 border-b pb-2">
                        <p className="font-medium">{sensor.type || 'Type inconnu'} - {sensor.location}</p>
                        
                        <ul className="mt-1 space-y-1">
                          {recentMeasures.map((measure, index) => (
                            <li key={measure._id || index} className="text-sm">
                              <div className="flex justify-between">
                                <span>
                                  {measure.value} {getMeasureUnit(measure.type || sensor.type)}
                                </span>
                                <span className="text-gray-500">
                                  {formatDate(measure.creationDate || measure.timestamp)}
                                </span>
                              </div>
                            </li>
                          ))}
                          
                          {sortedMeasures.length > 3 && (
                            <li className="text-xs text-gray-500">
                              +{sortedMeasures.length - 3} autre(s) mesure(s)
                            </li>
                          )}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-6 bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
        <h4 className="font-medium mb-1">Comment utiliser cette vue</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Cliquez sur un utilisateur pour voir ses capteurs et mesures associés</li>
          <li>Pour ajouter un capteur à un utilisateur, allez dans l'onglet "Capteurs"</li>
          <li>Pour ajouter une mesure à un capteur, allez dans l'onglet "Mesures"</li>
        </ul>
      </div>
    </div>
  );
};

export default DataRelationships;