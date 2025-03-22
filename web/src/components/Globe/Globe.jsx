import { useEffect, useRef } from "react";
import createGlobe from "cobe";

// Données utilisateurs directes (sans appel API)
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

// Transformer les données utilisateurs en marqueurs pour le globe
const transformUsersToMarkers = (users) => {
  const markers = [];
  const seenLocations = new Set(); // Pour éviter les doublons de localisation

  users.forEach(user => {
    const location = user.location.toLowerCase();
    const coordinates = countryCoordinates[location];
    
    if (coordinates && !seenLocations.has(location)) {
      // Calculer la taille du marqueur basée sur le nombre de personnes
      // (entre 0.03 et 0.1)
      const size = Math.min(0.03 + (user.personsInHouse / 10) * 0.07, 0.1);
      
      markers.push({
        location: coordinates,
        size,
      });
      
      seenLocations.add(location);
    }
  });
  
  return markers;
};

const Globe = ({ className }) => {
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  let phi = 0;

  useEffect(() => {
    // Convertir les données utilisateurs en marqueurs
    const markers = transformUsersToMarkers(usersData);
    
    let animationFrameId;
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
        
        // Création du globe
        globe = createGlobe(canvasRef.current, {
          devicePixelRatio: window.devicePixelRatio || 1,
          width: size,
          height: size,
          phi: 0,
          theta: 0.3,
          dark: 0,
          diffuse: 1.2,
          mapSamples: 16000,
          mapBrightness: 1.2,
          baseColor: [1, 1, 1],
          markerColor: [0.98, 0.39, 0.07], // Orange PE.IoT
          glowColor: [1, 1, 1],
          markers,
          onRender: (state) => {
            // Rotation automatique
            if (!pointerInteracting.current) {
              phi += 0.008;
            }
            state.phi = phi;
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
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Gestion des interactions avec la souris/tactile
  const updatePointerInteraction = (clientX) => {
    pointerInteracting.current = clientX;
    canvasRef.current.style.cursor = clientX ? "grabbing" : "grab";
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
      phi += delta / 200;
    }
  };

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

export default Globe;