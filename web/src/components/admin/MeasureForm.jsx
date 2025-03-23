// web/src/components/admin/MeasureForm.jsx
import { useState, useEffect } from 'react';
import { fetchEntities } from '../../services/apiService';

const MeasureForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: '',
    value: '',
    sensorID: '',
    creationDate: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si un item est fourni (en mode édition), initialiser le formulaire avec ses valeurs
    if (item && Object.keys(item).length > 0) {
      setFormData({
        ...item,
        // Assurer la cohérence des noms de champs
        sensorID: item.sensorID || '',
        value: item.value || '',
        type: item.type || '',
        creationDate: item.creationDate ? new Date(item.creationDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
    
    // Charger la liste des capteurs pour le sélecteur
    const loadSensors = async () => {
      try {
        setLoading(true);
        const sensorsData = await fetchEntities('sensors');
        setSensors(sensorsData);
      } catch (error) {
        console.error('Erreur lors du chargement des capteurs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSensors();
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
    
    if (!formData.value || isNaN(Number(formData.value))) {
      newErrors.value = 'Une valeur numérique est requise';
    }
    
    if (!formData.sensorID) {
      newErrors.sensorID = 'Le capteur est requis';
    }
    
    if (!formData.creationDate) {
      newErrors.creationDate = 'La date est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Créer une copie pour ne pas modifier directement l'état
      const submissionData = { 
        ...formData,
        // Assurer que la valeur est un nombre
        value: Number(formData.value)
      };
      
      // S'assurer que l'ID est préservé en mode édition
      if (item && item._id) {
        submissionData._id = item._id;
      }
      
      onSubmit(submissionData);
    }
  };

  // Obtenir les types de capteurs disponibles
  const getSensorTypes = () => {
    const sensorTypes = new Set();
    sensors.forEach(sensor => {
      if (sensor.type) {
        sensorTypes.add(sensor.type);
      }
    });
    return Array.from(sensorTypes);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium text-gray-800 mb-6">
        {item && item._id ? 'Modifier une mesure' : 'Ajouter une mesure'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type de mesure */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type de mesure*
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
        
        {/* Valeur de la mesure */}
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
            Valeur*
          </label>
          <div className="flex">
            <input
              type="number"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="ex: 21.5"
              step="0.1"
              className={`block w-full px-3 py-2 border rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.value ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              {formData.type === 'temperature' ? '°C' : 
               formData.type === 'humidity' ? '%' : 
               formData.type === 'airPollution' ? 'AQI' : ''}
            </span>
          </div>
          {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
        </div>
        
        {/* Capteur associé */}
        <div>
          <label htmlFor="sensorID" className="block text-sm font-medium text-gray-700 mb-1">
            Capteur*
          </label>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-t-2 border-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-500">Chargement des capteurs...</span>
            </div>
          ) : (
            <>
              <select
                id="sensorID"
                name="sensorID"
                value={formData.sensorID}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.sensorID ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner un capteur</option>
                {sensors.map(sensor => (
                  <option 
                    key={sensor._id} 
                    value={sensor._id}
                    // Désactiver les options incompatibles avec le type de mesure sélectionné
                    disabled={formData.type && sensor.type && formData.type !== sensor.type}
                  >
                    {sensor.type} - {sensor.location} - {sensor._id.substring(0, 8)}...
                  </option>
                ))}
              </select>
              {errors.sensorID && <p className="mt-1 text-sm text-red-600">{errors.sensorID}</p>}
              {formData.type && sensors.filter(s => !s.type || s.type === formData.type).length === 0 && (
                <p className="mt-1 text-sm text-amber-600">
                  Aucun capteur compatible avec ce type de mesure. Veuillez d'abord créer un capteur approprié.
                </p>
              )}
            </>
          )}
        </div>
        
        {/* Date de la mesure */}
        <div>
          <label htmlFor="creationDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date et heure*
          </label>
          <input
            type="datetime-local"
            id="creationDate"
            name="creationDate"
            value={formData.creationDate ? formData.creationDate.substring(0, 16) : ''}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.creationDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.creationDate && <p className="mt-1 text-sm text-red-600">{errors.creationDate}</p>}
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
}

// À la fin de MeasureForm.jsx
export default MeasureForm;