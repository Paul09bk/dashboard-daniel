// web/src/pages/admin.jsx
import { useState, useEffect } from 'react';
import DataTable from '../components/Admin/DataTable';
import DataForm from '../components/Admin/DataForm';
import UserDetail from '../components/admin/UserDetail';
import SensorDetail from '../components/admin/SensorDetail';
import AdminStatsDashboard from '../components/admin/AdminStatsDashboard';
import { 
  fetchEntities, 
  createEntity, 
  updateEntity, 
  deleteEntity 
} from '../services/apiService';

const AdminPage = () => {
  const [entities] = useState([
    { name: 'dashboard', label: 'Tableau de bord', apiEndpoint: null },
    { name: 'users', label: 'Utilisateurs', apiEndpoint: 'users' },
    { name: 'sensors', label: 'Capteurs', apiEndpoint: 'sensors' },
    { name: 'measures', label: 'Mesures', apiEndpoint: 'measures' }
  ]);
  
  const [activeEntity, setActiveEntity] = useState('dashboard');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [detailMode, setDetailMode] = useState(null); // 'user', 'sensor', null
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  // Définir les colonnes pour chaque entité
  const entityColumns = {
    users: [
      { key: 'location', label: 'Emplacement' },
      { key: 'personsInHouse', label: 'Personnes' },
      { key: 'houseSize', label: 'Taille du logement' },
      { key: 'createdAt', label: 'Date de création', render: (item) => 
        item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A' 
      }
    ],
    sensors: [
      { key: 'location', label: 'Emplacement' },
      { key: 'creationDate', label: 'Date d\'installation', render: (item) => 
        item.creationDate ? new Date(item.creationDate).toLocaleDateString() : 'N/A' 
      },
      { key: 'userID', label: 'Utilisateur' }
    ],
    measures: [
      { key: 'type', label: 'Type' },
      { key: 'value', label: 'Valeur' },
      { key: 'sensorID', label: 'Capteur' },
      { key: 'creationDate', label: 'Date', render: (item) => 
        item.creationDate ? new Date(item.creationDate).toLocaleString() : 'N/A'
      }
    ]
  };

  // Chargement des données lors du changement d'entité active
  useEffect(() => {
    if (activeEntity !== 'dashboard') {
      loadEntityData(activeEntity);
    } else {
      setLoading(false);
      setError(null);
    }
  }, [activeEntity]);

  // Fonction de chargement des données depuis l'API
  const loadEntityData = async (entityName) => {
    setLoading(true);
    setError(null);
    
    try {
      const selectedEntity = entities.find(e => e.name === entityName);
      const apiEndpoint = selectedEntity ? selectedEntity.apiEndpoint : entityName;
      
      if (apiEndpoint) {
        const fetchedData = await fetchEntities(apiEndpoint);
        setData(fetchedData);
      }
    } catch (err) {
      console.error(`Erreur lors du chargement des ${entityName}:`, err);
      setError(`Impossible de charger les données: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Gestion du changement d'entité
  const handleEntityChange = (entityName) => {
    setActiveEntity(entityName);
    setCurrentItem(null);
    setShowForm(false);
    setDetailMode(null);
    setSelectedItemId(null);
  };

  // Ajout d'un nouvel élément
  const handleAddNew = () => {
    // Créer un nouvel élément vide avec les clés appropriées
    const emptyItem = {};
    entityColumns[activeEntity].forEach(col => {
      if (col.key !== 'createdAt' && col.key !== 'updatedAt') {
        emptyItem[col.key] = '';
      }
    });
    
    setCurrentItem(emptyItem);
    setShowForm(true);
  };

  // Édition d'un élément existant
  const handleEdit = (item) => {
    setCurrentItem({...item});
    setShowForm(true);
    setDetailMode(null);
  };
  
  // Voir les détails d'un utilisateur
  const handleViewUserDetail = (item) => {
    setSelectedItemId(item._id);
    setDetailMode('user');
    setShowForm(false);
  };
  
  // Voir les détails d'un capteur
  const handleViewSensorDetail = (item) => {
    setSelectedItemId(item._id);
    setDetailMode('sensor');
    setShowForm(false);
  };
  
  // Retour aux données
  const handleBackFromDetail = () => {
    setDetailMode(null);
    setSelectedItemId(null);
  };

  // Suppression d'un élément
  const handleDelete = async (item) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        setLoading(true);
        
        const selectedEntity = entities.find(e => e.name === activeEntity);
        const apiEndpoint = selectedEntity ? selectedEntity.apiEndpoint : activeEntity;
        
        await deleteEntity(apiEndpoint, item._id);
        
        // Mettre à jour l'état local après la suppression
        setData(data.filter(i => i._id !== item._id));
        alert('Élément supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert(`Échec de la suppression: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Soumission du formulaire (création ou mise à jour)
  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      
      const selectedEntity = entities.find(e => e.name === activeEntity);
      const apiEndpoint = selectedEntity ? selectedEntity.apiEndpoint : activeEntity;
      
      let updatedItem;
      
      if (formData._id) {
        // Mise à jour d'un élément existant
        updatedItem = await updateEntity(apiEndpoint, formData._id, formData);
        
        // Mettre à jour l'état local
        setData(data.map(item => 
          item._id === formData._id ? updatedItem : item
        ));
        
        alert('Élément mis à jour avec succès');
      } else {
        // Création d'un nouvel élément
        const newItem = await createEntity(apiEndpoint, formData);
        
        // Ajouter le nouvel élément à l'état local
        setData([...data, newItem]);
        
        alert('Élément créé avec succès');
      }
      
      setShowForm(false);
      setCurrentItem(null);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      alert(`Échec de l'opération: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Annulation du formulaire
  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentItem(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-4 mb-4">
            {entities.map(entity => (
              <button
                key={entity.name}
                onClick={() => handleEntityChange(entity.name)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors 
                  ${activeEntity === entity.name 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                {entity.label}
              </button>
            ))}
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">
              {entities.find(e => e.name === activeEntity)?.label || 'Données'} - Administration
            </h1>
            <button 
              onClick={handleAddNew} 
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
          
          {activeEntity === 'dashboard' ? (
            <div className="space-y-6">

              <AdminStatsDashboard />
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-500">Chargement des données...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">Erreur</p>
              <p>{error}</p>
              <button 
                onClick={() => loadEntityData(activeEntity)}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Réessayer
              </button>
            </div>
          ) : detailMode === 'user' ? (
            <UserDetail 
              userId={selectedItemId} 
              onBack={handleBackFromDetail} 
            />
          ) : detailMode === 'sensor' ? (
            <SensorDetail 
              sensorId={selectedItemId} 
              onBack={handleBackFromDetail} 
            />
          ) : showForm ? (
            <DataForm 
              item={currentItem} 
              onSubmit={handleFormSubmit} 
              onCancel={handleFormCancel} 
            />
          ) : (
            <>
              <div className="mb-4 bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                <p>Total: <span className="font-semibold">{data.length}</span> éléments</p>
              </div>
              
              {/* Actions supplémentaires spécifiques à l'entité */}
              <div className="mb-4">
                {activeEntity === 'users' && (
                  <p className="text-sm text-gray-600 mb-2">
                    Cliquez sur "Voir détails" pour consulter les capteurs associés à un utilisateur.
                  </p>
                )}
                {activeEntity === 'sensors' && (
                  <p className="text-sm text-gray-600 mb-2">
                    Cliquez sur "Voir détails" pour consulter les mesures et statistiques d'un capteur.
                  </p>
                )}
              </div>
              
              <DataTable 
                data={data} 
                columns={entityColumns[activeEntity]} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                actionButtons={
                  activeEntity === 'users' 
                    ? [{ label: 'Voir détails', onClick: handleViewUserDetail, color: 'blue' }]
                    : activeEntity === 'sensors'
                    ? [{ label: 'Voir détails', onClick: handleViewSensorDetail, color: 'blue' }]
                    : []
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;