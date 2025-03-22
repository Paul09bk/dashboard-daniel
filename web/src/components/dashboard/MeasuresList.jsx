import { useState, useEffect } from 'react';
import { fetchSensors, fetchDetailedMeasures } from '../../services/apiService';

const MeasuresList = ({ selectedUserId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userSensors, setUserSensors] = useState([]);
  const [measures, setMeasures] = useState([]);

  // Fetch sensors for selected user
  useEffect(() => {
    const loadUserSensors = async () => {
      if (!selectedUserId) {
        setUserSensors([]);
        setMeasures([]);
        return;
      }
      
      try {
        setLoading(true);
        // Récupérer tous les capteurs
        const allSensors = await fetchSensors();
        console.log('Tous les capteurs:', allSensors);
        
        // Filtre pour les capteurs de l'utilisateur
        const userSensorsData = allSensors.filter(sensor => {
          const userId = String(selectedUserId).toLowerCase();
          return Object.entries(sensor).some(([key, value]) => {
            if (key.toLowerCase().includes('user') && value) {
              return String(value).toLowerCase() === userId;
            }
            return false;
          });
        });
        
        console.log('Capteurs de l\'utilisateur:', userSensorsData);
        setUserSensors(userSensorsData);
        
        // Si des capteurs sont trouvés, charger leurs mesures
        if (userSensorsData.length > 0) {
          const allMeasures = [];
          
          // Récupérer les mesures pour chaque capteur
          for (const sensor of userSensorsData) {
            try {
              const sensorId = sensor._id;
              console.log(`Récupération des mesures pour le capteur ${sensorId}`);
              
              const sensorMeasures = await fetchDetailedMeasures(sensorId);
              
              // Enrichir les mesures avec les informations du capteur et le lieu
              const enrichedMeasures = sensorMeasures.map(measure => ({
                ...measure,
                sensorType: measure.type || sensor.type || "inconnu",
                sensorLocation: sensor.location || "Lieu inconnu"
              }));
              
              allMeasures.push(...enrichedMeasures);
            } catch (err) {
              console.error(`Erreur lors de la récupération des mesures:`, err);
            }
          }
          
          console.log('Mesures récupérées:', allMeasures);
          
          // Trier par date la plus récente
          allMeasures.sort((a, b) => {
            const dateA = new Date(a.creationDate || a.timestamp || a.date || 0);
            const dateB = new Date(b.creationDate || b.timestamp || b.date || 0);
            return dateB - dateA;
          });
          
          setMeasures(allMeasures);
        } else {
          setMeasures([]);
        }
        
        setError(null);
      } catch (error) {
        console.error('Error fetching user sensors or measures:', error);
        setError('Erreur lors de la récupération des données');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserSensors();
  }, [selectedUserId]);
  
  // Format date pour affichage
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) return 'Format de date invalide';
      
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Format de date invalide';
    }
  };

  // Formater le type de capteur
  const formatSensorType = (type) => {
    if (!type) return "Inconnu";
    
    const typeMap = {
      "humidity": "Humidité",
      "airpollution": "Pollution de l'air",
      "airPollution": "Pollution de l'air",
      "temperature": "Température"
    };
    
    return typeMap[type.toLowerCase()] || type;
  };
  
  // Déterminer la couleur pour le type de capteur
  const getSensorTypeColor = (type) => {
    if (!type) return "bg-gray-200";
    
    const typeColorMap = {
      "humidity": "bg-blue-100 text-blue-800 border-blue-200",
      "airpollution": "bg-red-100 text-red-800 border-red-200",
      "airPollution": "bg-red-100 text-red-800 border-red-200",
      "temperature": "bg-amber-100 text-amber-800 border-amber-200"
    };
    
    return typeColorMap[type.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Rendez le contenu du tableau avec les nouvelles colonnes
  const renderMeasureRow = (measure, index) => {
    const sensorType = measure.type || measure.sensorType || "inconnu";
    const formattedType = formatSensorType(sensorType);
    const typeColor = getSensorTypeColor(sensorType);
    const measureValue = measure.value !== undefined ? measure.value : measure.data !== undefined ? measure.data : "N/A";
    const measureUnit = measure.unit || "";
    const timestamp = measure.creationDate || measure.timestamp || measure.date || "Date inconnue";
    const location = measure.sensorLocation || "Lieu inconnu";
    
    return (
      <tr 
        key={measure._id || `measure-${index}`} 
        className="border-t border-gray-200 hover:bg-gray-50"
      >
        <td className="p-2 text-sm text-gray-600">{formatDate(timestamp)}</td>
        <td className="p-2 text-sm text-gray-800">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
            {formattedType}
          </span>
        </td>
        <td className="p-2 text-sm text-gray-600">{location}</td>
        <td className="p-2 text-sm text-gray-800 text-right font-medium">
          {measureValue} {measureUnit}
        </td>
      </tr>
    );
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* En-tête fixe */}
      <div className="flex-none p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Mesures</h2>
        {selectedUserId && (
          <div className="text-sm bg-blue-50 py-1 px-3 rounded-full">
            <span className="font-medium text-blue-500">
              {userSensors.length} capteur{userSensors.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
      
      {/* Contenu avec défilement */}
      <div className="flex-1 overflow-auto p-4">
        {!selectedUserId ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Sélectionnez un utilisateur pour voir ses mesures</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : measures.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Aucune mesure trouvée pour cet utilisateur</p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Dernières mesures
            </h3>
            
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-600">Type de capteur</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-600">Lieu</th>
                  <th className="text-right p-2 text-sm font-medium text-gray-600">Valeur</th>
                </tr>
              </thead>
              <tbody>
                {measures.map((measure, index) => renderMeasureRow(measure, index))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeasuresList;