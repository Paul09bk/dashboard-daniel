import { useState } from 'react';
import Globe from '../Globe/Globe';
import MapBoxComponent from '../MapBox/MapBox';

const MapWidget = () => {
  const [view, setView] = useState('globe'); // 'globe' ou 'map'

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">MAP</h2>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              view === 'globe' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setView('globe')}
          >
            Globe
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              view === 'map' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setView('map')}
          >
            Map
          </button>
        </div>
      </div>

      <div className="relative w-full h-[350px] md:h-[400px] lg:h-[450px] rounded-lg overflow-hidden bg-gray-100">
        <div className="h-full w-full" style={{ display: view === 'globe' ? 'block' : 'none' }}>
          <Globe />
        </div>
        <div className="h-full w-full" style={{ display: view === 'map' ? 'block' : 'none' }}>
          <MapBoxComponent />
        </div>
      </div>
    </div>
  );
};

export default MapWidget;