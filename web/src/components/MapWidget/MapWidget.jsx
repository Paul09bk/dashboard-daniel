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
    <div className={`h-[500px] flex flex-col ${className}`} ref={containerRef}>
      {/* En-tête du widget */}
      <div className="flex-none flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Localisation des capteurs</h2>
        <div className="text-sm bg-blue-50 py-1 px-3 rounded-full">
          <span className="font-medium text-blue-500">
            {sensorCount} capteurs actifs
          </span>
        </div>
      </div>
  
      {/* Contenu principal */}
      <div className="flex-1 p-4">
        <div className="relative bg-gray-50 rounded-lg overflow-hidden h-full">
          <MapBoxComponent className="h-full w-full" />
        </div>
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