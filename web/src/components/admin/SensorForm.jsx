// web/src/components/admin/SensorForm.jsx
import { useState, useEffect } from 'react';
import { fetchEntities } from '../../services/apiService';

const SensorForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: '',
    model: '',
    location: 'bedroom', // Valeur par défaut
    userId: ''
  });
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si un item est fourni (en mode édition), initialiser le formulaire avec ses valeurs
    if (item && Object.keys(item).length > 0) {
      // Convertir userID ou userId pour assurer la cohérence
      const userId = item.userID || item.userId || '';
      
      setFormData({
        ...item,
        userId, // Utiliser la version normalisée
        type: item.type || '',
        model: item.model || '',
        location: item.location || 'bedroom'
      });
    }
    
    // Charger la liste des utilisateurs pour le sélecteur
    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersData = await fetchEntities('users');
        setUsers(usersData);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Effacer l'erreur pour ce champ lorsqu'il est modifié
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Validation des champs requis
    if (!formData.type.trim()) {
      newErrors.type = 'Le type est requis';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'Le modèle est requis';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'L\'emplacement est requis';
    }
    
    if (!formData.userId) {
      newErrors.userId = 'L\'utilisateur est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Créer une copie pour ne pas modifier directement l'état
      const submissionData = { ...formData };
      
      // S'assurer que l'ID est préservé en mode édition
      if (item && item._id) {
        submissionData._id = item._id;
      }
      
      onSubmit(submissionData);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium text-gray-800 mb-6">
        {item && item._id ? 'Modifier un capteur' : 'Ajouter un capteur'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type du capteur */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type de capteur*
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.type ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionner un type</option>
            <option value="temperature">Température</option>
            <option value="humidity">Humidité</option>
            <option value="airPollution">Pollution de l'air</option>
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
        </div>
        
        {/* Modèle du capteur */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            Modèle*
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="ex: XS200, Smart500, etc."
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.model ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
        </div>
        
        {/* Emplacement du capteur */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Emplacement*
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.location ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="bedroom">Chambre</option>
            <option value="livingroom">Salon</option>
            <option value="bathroom">Salle de bain</option>
            <option value="entrance">Entrée</option>
          </select>
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>
        
        {/* Utilisateur (propriétaire du capteur) */}
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
            Utilisateur*
          </label>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-t-2 border-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-500">Chargement des utilisateurs...</span>
            </div>
          ) : (
            <>
              <select
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.userId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner un utilisateur</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.location} - {user.personsInHouse} personnes - {user._id}
                  </option>
                ))}
              </select>
              {errors.userId && <p className="mt-1 text-sm text-red-600">{errors.userId}</p>}
            </>
          )}
        </div>
        
        {/* Date d'installation (optionnel) */}
        <div>
          <label htmlFor="creationDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date d'installation
          </label>
          <input
            type="date"
            id="creationDate"
            name="creationDate"
            value={formData.creationDate ? new Date(formData.creationDate).toISOString().split('T')[0] : ''}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {item && item._id ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SensorForm;