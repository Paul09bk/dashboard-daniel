import { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import createGlobe from "cobe";
import { fetchSensorLocations } from "../../services/apiService";

// Coordonnées géographiques des pays
const countryCoordinates = {
  'albania': [41.1533, 20.1683],
  'china': [35.8617, 104.1954],
  'czech republic': [49.8175, 15.473],
  'ecuador': [-1.8312, -78.1834],
  'ethiopia': [9.145, 40.4897],
  'greece': [39.0742, 21.8243],
  'italy': [41.8719, 12.5674],
  'japan': [36.2048, 138.2529],
  'malaysia': [4.2105, 101.9758],
  'mexico': [23.6345, -102.5528],
  'morocco': [31.7917, -7.0926],
  'peru': [-9.19, -75.0152],
  'philippines': [12.8797, 121.774],
  'poland': [51.9194, 19.1451],
  'russia': [61.524, 105.3188],
  'slovenia': [46.1512, 14.9955],
  'thailand': [15.87, 100.9925],
};

// Transformer les données des capteurs en marqueurs pour le globe
const transformSensorsToMarkers = (sensors) => {
  const locationCounts = new Map();
  
  // Compter les capteurs par emplacement
  sensors.forEach(sensor => {
    if (!sensor.userLocation) return;
    
    const location = sensor.userLocation.toLowerCase();
    if (!locationCounts.has(location)) {
      locationCounts.set(location, 1);
    } else {
      locationCounts.set(location, locationCounts.get(location) + 1);
    }
  });
  
  // Créer les marqueurs
  const markers = [];
  
  locationCounts.forEach((count, location) => {
    const coordinates = countryCoordinates[location];
    
    if (coordinates) {
      // Calculer la taille du marqueur basée sur le nombre de capteurs
      // (entre 0.03 et 0.1)
      const size = Math.min(0.03 + (count / 5) * 0.07, 0.1);
      
      markers.push({
        location: coordinates,
        size,
      });
    }
  });
  
  return markers;
};

const Globe = ({ className = '', miniGlobe = false }) => {
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [sensorCount, setSensorCount] = useState(0);
  const dataFetchedRef = useRef(false);

  // Récupérer les données des capteurs
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const data = await fetchSensorLocations();
        setSensors(data);
        setSensorCount(data.length);
        setLoading(false);
      } catch (err) {
        console.error("Globe: Error fetching data:", err);
        setError("Impossible de charger les données des capteurs.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Initialiser le globe avec les données
  useEffect(() => {
    if (loading || error || !sensors.length) return;
    
    // Convertir les données des capteurs en marqueurs
    const markers = transformSensorsToMarkers(sensors);
    
    let globe;
    
    // Cette fonction crée le globe avec une taille adaptée au conteneur
    const createGlobeInstance = () => {
      if (canvasRef.current) {
        // Obtenir la taille du conteneur
        const containerWidth = canvasRef.current.parentNode.clientWidth;
        const containerHeight = canvasRef.current.parentNode.clientHeight;
        
        // Utiliser la plus petite dimension pour avoir un globe bien proportionné
        const size = Math.min(containerWidth, containerHeight);
        
        // Configurer le canvas avec la taille appropriée
        canvasRef.current.width = size;
        canvasRef.current.height = size;
        
        // Configuration ajustée en fonction du mode miniGlobe
        const rotationSpeed = miniGlobe ? 0.01 : 0.005;
        
        // Création du globe avec meilleur contraste des continents
        globe = createGlobe(canvasRef.current, {
          devicePixelRatio: window.devicePixelRatio || 1,
          width: size,
          height: size,
          phi: 0,
          theta: 0.3,
          dark: 0,
          diffuse: 1.5,               // Augmenté pour plus de contraste
          mapSamples: miniGlobe ? 8000 : 16000,
          mapBrightness: 2.0,         // Augmenté pour rendre les continents plus visibles
          baseColor: [0.8, 0.8, 0.8], // Assombri pour meilleur contraste
          markerColor: [0.98, 0.39, 0.07],
          glowColor: [1, 1, 1],
          markers: miniGlobe ? [] : markers,
          opacity: 1.0,               // Opacité maximale
          onRender: (state) => {
            // Rotation automatique plus rapide pour le mini-globe
            if (!pointerInteracting.current) {
              phiRef.current += rotationSpeed;
            }
            state.phi = phiRef.current;
          }
        });
        
        // Rendre le globe visible après sa création
        canvasRef.current.style.opacity = '1';
      }
    };
    
    // Création initiale du globe
    createGlobeInstance();
    
    // Gérer le redimensionnement de la fenêtre
    const handleResize = () => {
      if (globe) {
        globe.destroy();
      }
      
      // Recréer le globe avec les nouvelles dimensions
      createGlobeInstance();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (globe) {
        globe.destroy();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [sensors, loading, error, miniGlobe]);

  // Gestion des interactions avec la souris/tactile
  const updatePointerInteraction = (clientX) => {
    // Désactiver l'interaction si c'est un mini-globe
    if (miniGlobe) return;
    
    pointerInteracting.current = clientX;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = clientX ? "grabbing" : "grab";
    }
  };

  const onPointerDown = (e) => {
    updatePointerInteraction(e.clientX);
  };

  const onPointerUp = () => {
    updatePointerInteraction(null);
  };

  const onPointerOut = () => {
    updatePointerInteraction(null);
  };

  const onMouseMove = (e) => {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      phiRef.current += delta / 200;
    }
  };

  // Afficher un message de chargement ou d'erreur si nécessaire (sauf en mode mini)
  if (loading && !miniGlobe) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error && !miniGlobe) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
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

  // Exposer le nombre de capteurs au parent
  if (typeof window !== 'undefined') {
    window.sensorCount = sensorCount;
  }

  // Pour le mini-globe, utiliser un style plus compact
  if (miniGlobe) {
    return (
      <div className={`${className}`}>
        <div className="relative aspect-square h-full w-full">
          <canvas
            ref={canvasRef}
            className="h-full w-full opacity-0 transition-opacity duration-500"
            style={{ 
              display: "block",
              margin: "0 auto"
            }}
          />
        </div>
      </div>
    );
  }

  // Affichage normal du globe
  return (
    <div className={`flex items-center justify-center h-full ${className}`}>
      <div className="relative aspect-square h-full max-h-full">
        <canvas
          ref={canvasRef}
          className="h-full w-full opacity-0 transition-opacity duration-500"
          style={{ 
            cursor: "grab",
            display: "block",
            margin: "0 auto"
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerOut={onPointerOut}
          onMouseMove={onMouseMove}
        />
      </div>
    </div>
  );
};

// Définition des PropTypes pour résoudre l'erreur ESLint
Globe.propTypes = {
  className: PropTypes.string,
  miniGlobe: PropTypes.bool
};

// Définition des valeurs par défaut
Globe.defaultProps = {
  className: '',
  miniGlobe: false
};

export default Globe;