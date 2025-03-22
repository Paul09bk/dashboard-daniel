import { useState } from 'react';

const UsersList = () => {
  const [activeTab, setActiveTab] = useState('pays');
  
  return (
    <div className="h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Users</h2>
        <div className="flex rounded-md overflow-hidden border border-gray-200">
          <button 
            className={`px-4 py-1 text-sm ${activeTab === 'pays' ? 'bg-gray-200 font-medium' : 'bg-white'}`}
            onClick={() => setActiveTab('pays')}
          >
            Pays
          </button>
          <button 
            className={`px-4 py-1 text-sm ${activeTab === 'taille' ? 'bg-gray-200 font-medium' : 'bg-white'}`}
            onClick={() => setActiveTab('taille')}
          >
            Taille
          </button>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">LIST</h2>
        <div className="text-gray-600">
          {activeTab === 'pays' ? (
            <div>
              {/* User list by country would go here */}
              <p>User statistics by country would appear here</p>
            </div>
          ) : (
            <div>
              {/* User list by size would go here */}
              <p>User statistics by size would appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersList;