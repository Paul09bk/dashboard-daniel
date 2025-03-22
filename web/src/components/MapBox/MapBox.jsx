/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Données utilisateurs directes
const usersData = [
  {"location":"ethiopia","personsInHouse":4,"houseSize":"medium"},
  {"location":"czech republic","personsInHouse":6,"houseSize":"small"},
  {"location":"italy","personsInHouse":2,"houseSize":"big"},
  {"location":"greece","personsInHouse":4,"houseSize":"medium"},
  {"location":"china","personsInHouse":5,"houseSize":"medium"},
  {"location":"poland","personsInHouse":4,"houseSize":"big"},
  {"location":"thailand","personsInHouse":1,"houseSize":"medium"},
  {"location":"china","personsInHouse":5,"houseSize":"small"},
  {"location":"morocco","personsInHouse":3,"houseSize":"big"},
  {"location":"china","personsInHouse":1,"houseSize":"big"},
  {"location":"malaysia","personsInHouse":1,"houseSize":"medium"},
  {"location":"slovenia","personsInHouse":2,"houseSize":"small"},
  {"location":"philippines","personsInHouse":5,"houseSize":"medium"},
  {"location":"mexico","personsInHouse":3,"houseSize":"big"},
  {"location":"ecuador","personsInHouse":2,"houseSize":"big"},
  {"location":"china","personsInHouse":6,"houseSize":"big"},
  {"location":"albania","personsInHouse":6,"houseSize":"medium"},
  {"location":"japan","personsInHouse":2,"houseSize":"small"},
  {"location":"peru","personsInHouse":2,"houseSize":"small"},
  {"location":"russia","personsInHouse":5,"houseSize":"medium"}
];

// Coordonnées géographiques des pays (format: [longitude, latitude] pour MapBox)
const countryCoordinates = {
  'albania': [20.1683, 41.1533],
  'china': [104.1954, 35.8617],
  'czech republic': [15.473, 49.8175],
  'ecuador': [-78.1834, -1.8312],
  'ethiopia': [40.4897, 9.145],
  'greece': [21.8243, 39.0742],
  'italy': [12.5674, 41.8719],
  'japan': [138.2529, 36.2048],
  'malaysia': [101.9758, 4.2105],
  'mexico': [-102.5528, 23.6345],
  'morocco': [-7.0926, 31.7917],
  'peru': [-75.0152, -9.19],
  'philippines': [121.774, 12.8797],
  'poland': [19.1451, 51.9194],
  'russia': [105.3188, 61.524],
  'slovenia': [14.9955, 46.1512],
  'thailand': [100.9925, 15.87],
};

// Constante fixe pour l'ID du conteneur
const MAP_CONTAINER_ID = 'mapbox-container-fixed';

const MapBoxComponent = ({ className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let map = null;
    
    // Fonction d'initialisation de la carte
    const initializeMap = () => {
      // Vérifier si la carte existe déjà
      if (map) return;
      
      // Vérifier si le conteneur existe
      const container = document.getElementById(MAP_CONTAINER_ID);
      if (!container) {
        console.error(`Conteneur #${MAP_CONTAINER_ID} non trouvé`);
        setError("Conteneur de carte non trouvé");
        setLoading(false);
        return;
      }
      
      // Vérifier que les dimensions du conteneur sont correctes
      if (container.offsetWidth === 0 || container.offsetHeight === 0) {
        console.error("Conteneur avec dimensions nulles");
        return; // Réessayer plus tard
      }
      
      // Récupérer le token MapBox depuis les variables d'environnement
      const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      console.log("Token disponible:", !!MAPBOX_TOKEN);
      
      if (!MAPBOX_TOKEN) {
        setError("Token MapBox non trouvé. Vérifiez votre fichier .env");
        setLoading(false);
        return;
      }
      
      try {
        // Configurer MapBox
        mapboxgl.accessToken = MAPBOX_TOKEN;
        
        // Créer la carte
        map = new mapboxgl.Map({
          container: MAP_CONTAINER_ID,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [0, 20],
          zoom: 1.5,
          preserveDrawingBuffer: true
        });
        
        // Ajouter les contrôles
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Traiter les marqueurs une fois la carte chargée
        map.on('load', () => {
          console.log("Carte chargée avec succès");
          
          // Transformer les données en marqueurs
          const locationMarkers = new Map();
          
          usersData.forEach(user => {
            const location = user.location.toLowerCase();
            const coordinates = countryCoordinates[location];
            
            if (coordinates) {
              const key = `${coordinates[0]},${coordinates[1]}`;
              
              if (!locationMarkers.has(key)) {
                locationMarkers.set(key, {
                  coordinates,
                  personsInHouse: user.personsInHouse,
                  location: user.location,
                  houseSize: user.houseSize
                });
              } else {
                // Additionner les personnes pour le même emplacement
                const marker = locationMarkers.get(key);
                marker.personsInHouse += user.personsInHouse;
              }
            }
          });
          
          // Ajouter les marqueurs à la carte
          locationMarkers.forEach(marker => {
            // Créer un élément pour le marqueur
            const el = document.createElement('div');
            const size = Math.max(20, marker.personsInHouse * 4);
            
            // Styliser le marqueur
            el.style.backgroundColor = '#FA6310';
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.borderRadius = '50%';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            el.style.color = 'white';
            el.style.fontWeight = 'bold';
            el.style.fontSize = '10px';
            el.style.boxShadow = '0 0 10px rgba(250, 99, 16, 0.5)';
            el.innerHTML = marker.personsInHouse;
            
            // Créer le popup
            const popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-bold text-sm capitalize">${marker.location}</h3>
                  <p class="text-xs">Personnes: ${marker.personsInHouse}</p>
                  <p class="text-xs capitalize">Taille: ${marker.houseSize}</p>
                </div>
              `);
            
            // Ajouter le marqueur à la carte
            new mapboxgl.Marker(el)
              .setLngLat(marker.coordinates)
              .setPopup(popup)
              .addTo(map);
          });
          
          setLoading(false);
        });
        
        // Gérer les erreurs
        map.on('error', (e) => {
          console.error("Erreur MapBox:", e);
          setError(`Erreur MapBox: ${e.error?.message || 'Erreur inconnue'}`);
          setLoading(false);
        });
      } catch (err) {
        console.error("Erreur d'initialisation:", err);
        setError(`Erreur d'initialisation: ${err.message}`);
        setLoading(false);
      }
    };
    
    // Attendre un peu que le DOM soit prêt
    const timer = setTimeout(() => {
      initializeMap();
    }, 1000);
    
    // Réessayer plusieurs fois si nécessaire
    const retryInterval = setInterval(() => {
      if (!map) {
        initializeMap();
      } else {
        clearInterval(retryInterval);
      }
    }, 500);
    
    // Nettoyer
    return () => {
      clearTimeout(timer);
      clearInterval(retryInterval);
      
      if (map) {
        map.remove();
      }
    };
  }, []);

  if (error) {
    return (
      <div className={`h-full w-full flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <p className="text-red-500 font-bold mb-2">Erreur</p>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-gray-600">Chargement de la carte...</p>
          </div>
        </div>
      )}
      
      <div 
        id={MAP_CONTAINER_ID}
        className={`h-full w-full ${className}`}
        style={{ borderRadius: '8px' }}
      />
    </>
  );
};

export default MapBoxComponent;