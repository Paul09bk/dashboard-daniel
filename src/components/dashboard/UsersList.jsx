import { useState, useEffect } from 'react';
import { fetchUsers } from '../../services/apiService';

const UsersList = ({ onUserSelect }) => {
  const [activeTab, setActiveTab] = useState('pays');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch users data when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchUsers();
        console.log('Utilisateurs chargés:', data); // Log pour débogage
        setUsers(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Erreur lors de la récupération des utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Handle user selection
  const handleUserClick = (userId) => {
    console.log('Utilisateur sélectionné, ID:', userId); // Log pour débogage
    setSelectedUserId(userId);
    if (onUserSelect) {
      onUserSelect(userId);
    }
  };

  // Group users by country
  const getUsersByCountry = () => {
    const groupedUsers = {};
    users.forEach(user => {
      const country = user.location || 'Unknown';
      if (!groupedUsers[country]) {
        groupedUsers[country] = [];
      }
      groupedUsers[country].push(user);
    });
    return groupedUsers;
  };

  // Group users by house size
  const getUsersBySize = () => {
    const groupedUsers = {
      small: [],
      medium: [],
      big: []
    };
    
    users.forEach(user => {
      if (user.houseSize && groupedUsers[user.houseSize]) {
        groupedUsers[user.houseSize].push(user);
      }
    });
    
    return groupedUsers;
  };

  // Render each user item
  const renderUserItem = (user) => {
    return (
      <li 
        key={user._id} 
        className={`text-sm p-2 rounded mb-1 hover:bg-blue-50 cursor-pointer border ${
          selectedUserId === user._id ? 'bg-blue-100 border-blue-300' : 'border-transparent'
        }`}
        onClick={() => handleUserClick(user._id)}
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium text-gray-800 capitalize">{user.location}</span>
            <div className="text-xs text-gray-500">ID: {user._id}</div>
          </div>
          <div className="text-right">
            <div className="text-xs">Maison: <span className="font-medium">{user.houseSize}</span></div>
            <div className="text-xs">Personnes: <span className="font-medium">{user.personsInHouse}</span></div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* En-tête fixe */}
      <div className="flex-none flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Utilisateurs</h2>
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
      
      {/* Contenu avec défilement */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : (
          <div>
            {/* Info sur la sélection */}
            {selectedUserId && (
              <div className="p-2 mb-3 bg-blue-50 text-sm rounded border border-blue-100">
                Utilisateur sélectionné: <span className="font-medium">{selectedUserId}</span>
              </div>
            )}
            
            {activeTab === 'pays' ? (
              <div className="space-y-4">
                {Object.entries(getUsersByCountry()).length === 0 ? (
                  <p className="text-gray-500">Aucun utilisateur trouvé</p>
                ) : (
                  Object.entries(getUsersByCountry()).map(([country, usersList]) => (
                    <div key={country} className="border rounded-lg p-3 bg-white">
                      <h3 className="font-medium text-gray-800 capitalize mb-2">
                        {country} <span className="text-sm text-blue-500">({usersList.length})</span>
                      </h3>
                      <ul className="space-y-1">
                        {usersList.map(user => renderUserItem(user))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(getUsersBySize()).map(([size, usersList]) => (
                  usersList.length > 0 && (
                    <div key={size} className="border rounded-lg p-3 bg-white">
                      <h3 className="font-medium text-gray-800 capitalize mb-2">
                        {size === 'small' ? 'Petite' : size === 'medium' ? 'Moyenne' : 'Grande'} 
                        <span className="text-sm text-blue-500 ml-1">({usersList.length})</span>
                      </h3>
                      <ul className="space-y-1">
                        {usersList.map(user => renderUserItem(user))}
                      </ul>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;