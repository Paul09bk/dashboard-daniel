// web/src/components/Admin/UserDetail.jsx
import { useState, useEffect } from 'react';
import { fetchUserWithSensors } from '../../services/apiService';

const UserDetail = ({ userId, onBack }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const userData = await fetchUserWithSensors(userId);
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des détails utilisateur:', err);
        setError(`Impossible de charger les données: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

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

  // Traduire la taille de maison
  const translateHouseSize = (size) => {
    const sizes = {
      'small': 'Petite',
      'medium': 'Moyenne',
      'big': 'Grande'
    };
    return sizes[size] || size;
  };

  // Déterminer la couleur pour le type de capteur
  const getSensorTypeColor = (location) => {
    const locationColors = {
      'bedroom': 'bg-blue-100 text-blue-800',
      'livingroom': 'bg-green-100 text-green-800',
      'bathroom': 'bg-purple-100 text-purple-800',
      'entrance': 'bg-yellow-100 text-yellow-800'
    };
    return locationColors[location] || 'bg-gray-100 text-gray-800';
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

  if (!user) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">Aucun utilisateur sélectionné</p>
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
            Détails de l'utilisateur
          </h2>
        </div>
        <div className="text-sm bg-blue-50 py-1 px-3 rounded-full">
          <span className="font-medium text-blue-500">
            ID: {user._id}
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
              activeTab === 'sensors' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('sensors')}
          >
            Capteurs ({user.sensors?.length || 0})
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="p-4">
        {activeTab === 'info' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Informations générales</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Emplacement:</span>
                  <p className="font-medium capitalize">{user.location}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Personnes dans le foyer:</span>
                  <p className="font-medium">{user.personsInHouse}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Taille du logement:</span>
                  <p className="font-medium">{translateHouseSize(user.houseSize)}</p>
                </div>
                {user.createdAt && (
                  <div>
                    <span className="text-sm text-gray-500">Date de création:</span>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Statistiques</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Nombre de capteurs:</span>
                  <p className="font-medium">{user.sensors?.length || 0}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Date du dernier capteur ajouté:</span>
                  <p className="font-medium">
                    {user.sensors && user.sensors.length > 0 
                      ? formatDate(user.sensors.sort((a, b) => 
                          new Date(b.creationDate) - new Date(a.creationDate)
                        )[0].creationDate)
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Capteurs installés</h3>
            
            {user.sensors && user.sensors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.sensors.map(sensor => (
                  <div 
                    key={sensor._id} 
                    className="border rounded-lg p-3 bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span 
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSensorTypeColor(sensor.location)}`}
                        >
                          {sensor.location}
                        </span>
                        <p className="mt-2 text-sm text-gray-500">ID: {sensor._id}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {formatDate(sensor.creationDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucun capteur associé à cet utilisateur
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;