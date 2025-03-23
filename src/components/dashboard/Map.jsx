const Map = () => {
    return (
      <div className="h-full">
        <h2 className="text-xl font-bold text-gray-800 p-4 border-b border-gray-200">MAP</h2>
        <div className="p-4">
          <div className="bg-blue-900 rounded-lg overflow-hidden">
            <img 
              src="/map-placeholder.jpg" 
              alt="World Map" 
              className="w-full h-64 object-cover opacity-70" 
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default Map;