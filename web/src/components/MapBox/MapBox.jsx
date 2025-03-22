import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { fetchSensors, fetchUsers } from '../../services/apiService';

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

const MapBoxComponent = React.memo(function MapBoxComponent(props) {
  const { className } = props;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [sensorTypes, setSensorTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const containerRef = useRef(null);
  const dataFetchedRef = useRef(false);
  const resizeObserverRef = useRef(null);

  // Récupérer les données des capteurs et des utilisateurs
  useEffect(() => {
    // Éviter les doubles requêtes
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer à la fois les capteurs et les utilisateurs
        const [sensorsData, usersData] = await Promise.all([
          fetchSensors(),
          fetchUsers()
        ]);
        
        console.log('Capteurs récupérés:', sensorsData.length);
        console.log('Utilisateurs récupérés:', usersData.length);
        
        setSensors(sensorsData);
        setUsers(usersData);
        
        // Extraire tous les types de capteurs uniques pour le filtre
        const types = [...new Set(sensorsData.map(sensor => sensor.type).filter(Boolean))];
        setSensorTypes(types);
        
        // Initialiser avec tous les capteurs
        setFilteredSensors(sensorsData);
        setLoading(false);
      } catch (err) {
        console.error("MapBox: Error fetching data:", err);
        setError(`Impossible de charger les données: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Gérer le redimensionnement de la carte
  useEffect(() => {
    if (!mapRef.current || !containerRef.current) return;
    
    // Mettre à jour la taille de la carte lors du redimensionnement
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    };
    
    // Observer les changements de dimensions du conteneur
    if ('ResizeObserver' in window && !resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        handleResize();
      });
      
      resizeObserverRef.current.observe(containerRef.current);
    }
    
    // Fallback pour les navigateurs sans ResizeObserver
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Mettre à jour la carte avec les données
  const updateMapMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    
    // Supprimer les marqueurs existants
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Regrouper les utilisateurs par localisation
    const locationUsers = new Map();
    
    users.forEach(user => {
      if (user.location) {
        const location = user.location.toLowerCase();
        const coordinates = countryCoordinates[location];
        
        if (coordinates) {
          const key = `${coordinates[0]},${coordinates[1]}`;
          
          if (!locationUsers.has(key)) {
            locationUsers.set(key, {
              coordinates,
              location: user.location,
              users: [user],
              totalPersons: user.personsInHouse || 0
            });
          } else {
            const data = locationUsers.get(key);
            data.users.push(user);
            data.totalPersons += user.personsInHouse || 0;
          }
        }
      }
    });
    
    console.log(`${locationUsers.size} emplacements d'utilisateurs trouvés`);
    
    // Associer les capteurs à leurs utilisateurs (pour les détails du popup)
    const userSensors = new Map();
    
    sensors.forEach(sensor => {
      if (sensor.userID) {
        if (!userSensors.has(sensor.userID)) {
          userSensors.set(sensor.userID, []);
        }
        userSensors.get(sensor.userID).push(sensor);
      }
    });
    
    // Créer et ajouter les marqueurs
    locationUsers.forEach(locationData => {
      // Créer un élément pour le marqueur
      const el = document.createElement('div');
      const userCount = locationData.users.length; // Utiliser le nombre d'utilisateurs
      
      // Calcul de taille ajusté pour ne pas être trop grand
      // Base de 20px + 3px par utilisateur, avec un maximum de 35px
      const size = Math.max(20, Math.min(35, 20 + userCount * 3));
      
      // Styliser le marqueur avec la couleur bleue
      el.style.backgroundColor = '#3B82F6'; // Bleu
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.borderRadius = '50%';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = 'white';
      el.style.fontWeight = 'bold';
      el.style.fontSize = `${Math.max(10, Math.min(14, 10 + userCount / 2))}px`;
      el.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)'; // Ombre bleue
      el.innerHTML = userCount; // Afficher le nombre d'utilisateurs
      
      // Calculer le nombre total de capteurs pour cet emplacement
      let totalSensors = 0;
      locationData.users.forEach(user => {
        const userSensorsList = userSensors.get(user._id) || [];
        totalSensors += userSensorsList.length;
      });
      
      // Préparer le contenu du popup
      const popupContent = `
        <div class="p-3 max-w-xs">
          <h3 class="font-bold text-lg capitalize mb-2">${locationData.location}</h3>
          
          <div class="mb-3 p-2 bg-gray-100 rounded">
            <p class="text-sm"><span class="font-semibold">Nombre d'utilisateurs:</span> ${userCount}</p>
            <p class="text-sm"><span class="font-semibold">Nombre de personnes total:</span> ${locationData.totalPersons}</p>
            <p class="text-sm"><span class="font-semibold">Nombre de capteurs:</span> ${totalSensors}</p>
          </div>
          
          <h4 class="font-semibold text-sm mb-2">Détails des utilisateurs:</h4>
          <ul class="space-y-2">
            ${locationData.users.map(user => {
              const userSensorsList = userSensors.get(user._id) || [];
              return `
                <li class="p-2 bg-blue-50 rounded text-xs">
                  <p><span class="font-semibold">Personnes:</span> ${user.personsInHouse || 0}</p>
                  <p><span class="font-semibold">Taille:</span> ${user.houseSize || 'N/A'}</p>
                  <p><span class="font-semibold">Capteurs:</span> ${userSensorsList.length}</p>
                </li>
              `;
            }).join('')}
          </ul>
        </div>
      `;
      
      // Créer le popup
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        maxWidth: '300px'
      }).setHTML(popupContent);
      
      // Ajouter le marqueur à la carte
      const marker = new mapboxgl.Marker(el)
        .setLngLat(locationData.coordinates)
        .setPopup(popup)
        .addTo(map);
      
      markersRef.current.push(marker);
    });
    
    console.log(`${markersRef.current.length} marqueurs ajoutés à la carte`);
  }, [sensors, users]);

  // Filtrer les capteurs lorsque le type sélectionné change
  useEffect(() => {
    if (!sensors.length) return;
    
    if (selectedType === 'all') {
      setFilteredSensors(sensors);
    } else {
      const filtered = sensors.filter(sensor => sensor.type === selectedType);
      setFilteredSensors(filtered);
    }
  }, [selectedType, sensors]);

  // Mettre à jour les marqueurs lorsque les capteurs filtrés changent
  useEffect(() => {
    if (mapRef.current && users.length > 0) {
      updateMapMarkers();
    }
  }, [filteredSensors, users, updateMapMarkers]);

  // Initialiser la carte une seule fois
  useEffect(() => {
    if (loading || error) return;
    
    // Si la carte est déjà initialisée, ne rien faire
    if (mapRef.current) return;
    
    // Vérifier le token Mapbox
    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!MAPBOX_TOKEN) {
      setError("Token MapBox non trouvé. Vérifiez votre fichier .env");
      return;
    }
    
    // Créer la carte une seule fois
    const initializeMap = () => {
      // Vérifier si le conteneur existe
      const container = document.getElementById(MAP_CONTAINER_ID);
      if (!container) {
        setError("Conteneur de carte non trouvé");
        return;
      }
      
      // Vérifier que les dimensions du conteneur sont correctes
      if (container.offsetWidth === 0 || container.offsetHeight === 0) {
        return; // Réessayer plus tard
      }
      
      try {
        // Configurer MapBox
        mapboxgl.accessToken = MAPBOX_TOKEN;
        
        // Créer la carte
        const map = new mapboxgl.Map({
          container: MAP_CONTAINER_ID,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [0, 20],
          zoom: 1.5,
          preserveDrawingBuffer: true
        });
        
        // Ajouter les contrôles
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Stocker la référence de la carte
        mapRef.current = map;
        
        // Ajouter les marqueurs une fois la carte chargée
        map.on('load', () => {
          console.log("Carte chargée avec succès");
          if (users.length > 0) {
            updateMapMarkers();
          }
        });
        
        // Gérer les erreurs
        map.on('error', (e) => {
          console.error("Erreur MapBox:", e);
          setError(`Erreur MapBox: ${e.error?.message || 'Erreur inconnue'}`);
        });
      } catch (err) {
        console.error("Erreur d'initialisation:", err);
        setError(`Erreur d'initialisation: ${err.message}`);
      }
    };
    
    // Attendre un peu que le DOM soit prêt
    const timer = setTimeout(() => {
      initializeMap();
    }, 500);
    
    // Nettoyage
    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [loading, error, updateMapMarkers, users.length]);

  // Gérer le changement de filtre
  const handleFilterChange = (e) => {
    setSelectedType(e.target.value);
  };

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
    <div className="relative h-full w-full" ref={containerRef}>
      {/* Filtre par type de capteur - responsive */}
      {sensorTypes.length > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-white p-2 rounded shadow-md max-w-[180px] md:max-w-[240px]">
          <label htmlFor="sensorTypeFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrer par type
          </label>
          <select
            id="sensorTypeFilter"
            value={selectedType}
            onChange={handleFilterChange}
            className="block w-full px-2 py-1 md:px-3 md:py-2 bg-white border border-gray-300 rounded text-xs md:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les types</option>
            {sensorTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-t-2 border-b-2 border-blue-500 mb-2 md:mb-3"></div>
            <p className="text-gray-600 text-sm md:text-base">Chargement de la carte...</p>
          </div>
        </div>
      )}
      
      <div 
        id={MAP_CONTAINER_ID}
        className={`h-full w-full ${className}`}
        style={{ 
          borderRadius: '8px',
          minHeight: '300px',
          height: '100%' 
        }}
      />
    </div>
  );
});

// Définir les PropTypes pour résoudre l'erreur ESLint
MapBoxComponent.propTypes = {
  className: PropTypes.string
};

// Valeur par défaut pour className
MapBoxComponent.defaultProps = {
  className: ''
};

export default MapBoxComponent;