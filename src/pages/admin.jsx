import { useState, useEffect } from 'react';
import DataTable from '../components/Admin/DataTable';
import DataForm from '../components/Admin/DataForm';
// import { fetchEntities, fetchEntityData, createItem, updateItem, deleteItem } from '../services/api';

const AdminPage = () => {
  const [entities, setEntities] = useState([
    { name: 'users', label: 'Users' },
    { name: 'sensors', label: 'Sensors' },
    { name: 'measures', label: 'Measures' }
  ]);
  const [activeEntity, setActiveEntity] = useState('users');
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  
  // Define columns for each entity
  const entityColumns = {
    users: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' },
      { key: 'createdAt', label: 'Created At', render: (item) => new Date(item.createdAt).toLocaleDateString() }
    ],
    sensors: [
      { key: 'sensorId', label: 'Sensor ID' },
      { key: 'type', label: 'Type' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status' }
    ],
    measures: [
      { key: 'sensorId', label: 'Sensor ID' },
      { key: 'value', label: 'Value' },
      { key: 'unit', label: 'Unit' },
      { key: 'timestamp', label: 'Timestamp', render: (item) => new Date(item.timestamp).toLocaleString() }
    ]
  };

  // Mock data
  const mockData = {
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', createdAt: '2023-01-15T08:30:00' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', createdAt: '2023-02-20T10:15:00' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', createdAt: '2023-03-05T14:45:00' }
    ],
    sensors: [
      { id: 1, sensorId: 'SENS001', type: 'Temperature', location: 'Building A', status: 'Active' },
      { id: 2, sensorId: 'SENS002', type: 'Humidity', location: 'Building B', status: 'Active' },
      { id: 3, sensorId: 'SENS003', type: 'Pressure', location: 'Building A', status: 'Inactive' }
    ],
    measures: [
      { id: 1, sensorId: 'SENS001', value: '23.5', unit: '°C', timestamp: '2023-04-10T09:30:00' },
      { id: 2, sensorId: 'SENS002', value: '45', unit: '%', timestamp: '2023-04-10T09:35:00' },
      { id: 3, sensorId: 'SENS001', value: '24.1', unit: '°C', timestamp: '2023-04-10T10:30:00' }
    ]
  };

  useEffect(() => {
    loadEntityData(activeEntity);
  }, [activeEntity]);

  const loadEntityData = async (entityName) => {
    setLoading(true);
    try {
      // Uncomment this when your API is ready
      // const data = await fetchEntityData(entityName);
      // setData(data);
      
      // For now, use mock data
      setTimeout(() => {
        setData(mockData[entityName] || []);
        setColumns(entityColumns[entityName] || []);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error(`Error loading ${entityName} data:`, error);
      setLoading(false);
    }
  };

  const handleEntityChange = (entityName) => {
    setActiveEntity(entityName);
    setCurrentItem(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    const emptyItem = {};
    columns.forEach(col => {
      emptyItem[col.key] = '';
    });
    setCurrentItem(emptyItem);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        // Uncomment this when your API is ready
        // await deleteItem(activeEntity, item.id || item._id);
        
        // For now, just update the UI
        setData(data.filter(i => i.id !== item.id));
        alert('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formData.id || formData._id) {
        // Update existing item
        // Uncomment this when your API is ready
        // const updatedItem = await updateItem(activeEntity, formData.id || formData._id, formData);
        
        // For now, just update the UI
        const updatedData = data.map(item => 
          (item.id === formData.id) ? formData : item
        );
        setData(updatedData);
      } else {
        // Create new item
        // Uncomment this when your API is ready
        // const newItem = await createItem(activeEntity, formData);
        
        // For now, just update the UI
        const newItem = { ...formData, id: Date.now() };
        setData([...data, newItem]);
      }
      
      setShowForm(false);
      setCurrentItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    }
  };

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
              {entities.find(e => e.name === activeEntity)?.label || 'Data'} Management
            </h1>
            <button 
              onClick={handleAddNew} 
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Add New
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading data...</p>
            </div>
          ) : showForm ? (
            <DataForm 
              item={currentItem} 
              onSubmit={handleFormSubmit} 
              onCancel={handleFormCancel} 
            />
          ) : (
            <DataTable 
              data={data} 
              columns={columns} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;