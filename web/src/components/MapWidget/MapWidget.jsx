import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import MapBoxComponent from '../MapBox/MapBox';
import { fetchSensors } from '../../services/apiService';

const MapWidget = ({ className = '' }) => {
  const [sensorCount, setSensorCount] = useState(0);
  const containerRef = useRef(null);
  const resizeObserverRef = useRef(null);
  
  // Récupérer le nombre total de capteurs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSensors();
        setSensorCount(data.length);
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre de capteurs:", error);
      }
    };
    
    fetchData();
  }, []);

  // Gestion de la responsivité
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Observer les changements de dimensions du conteneur
    if ('ResizeObserver' in window && !resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        // Les composants enfants gèrent leur propre responsivité
      });
      
      resizeObserverRef.current.observe(containerRef.current);
    }
    
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div 
      className={`flex flex-col h-full w-full ${className}`}
      ref={containerRef}
    >
      {/* En-tête du widget responsive */}
      <div className="bg-white p-3 sm:p-4 rounded-t-lg shadow-sm flex justify-between items-center">
        {/* Titre */}
        <h2 className="text-base sm:text-lg font-bold text-gray-800">Localisation des capteurs</h2>
        
        {/* Statistiques */}
        <div className="text-xs sm:text-sm bg-blue-50 py-1 sm:py-2 px-2 sm:px-4 rounded-full">
          <span className="font-medium text-blue-500">
            {sensorCount} capteurs actifs
          </span>
        </div>
      </div>
      
      {/* Contenu du widget - uniquement la carte */}
      <div className="flex-1 relative bg-gray-50 rounded-b-lg overflow-hidden min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
        <MapBoxComponent className="h-full" />
      </div>
    </div>
  );
};

// Définition des PropTypes pour résoudre l'erreur ESLint
MapWidget.propTypes = {
  className: PropTypes.string
};

// Définition des valeurs par défaut
MapWidget.defaultProps = {
  className: ''
};

export default MapWidget;