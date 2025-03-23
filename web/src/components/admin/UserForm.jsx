// web/src/components/admin/UserForm.jsx
import { useState, useEffect } from 'react';

const UserForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    location: '',
    personsInHouse: 1,
    houseSize: 'small'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Si un item est fourni (en mode édition), initialiser le formulaire avec ses valeurs
    if (item && Object.keys(item).length > 0) {
      setFormData({
        ...item,
        location: item.location || '',
        personsInHouse: item.personsInHouse || 1,
        houseSize: item.houseSize || 'small'
      });
    } else {
      // Pour un nouvel utilisateur, définir les valeurs par défaut
      setFormData({
        location: '',
        personsInHouse: 1,
        houseSize: 'small'
      });
    }
  }, [item]);

  // Déterminer automatiquement la taille de la maison en fonction du nombre de personnes
  useEffect(() => {
    const numPersons = parseInt(formData.personsInHouse) || 0;
    let newHouseSize;
    
    if (numPersons <= 2) {
      newHouseSize = 'small';
    } else if (numPersons <= 4) {
      newHouseSize = 'medium';
    } else {
      newHouseSize = 'big';
    }
    
    // Mettre à jour la taille de la maison seulement si elle a changé
    if (newHouseSize !== formData.houseSize) {
      setFormData(prev => ({ ...prev, houseSize: newHouseSize }));
    }
  }, [formData.personsInHouse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Pour le nombre de personnes, s'assurer que c'est un nombre positif
    if (name === 'personsInHouse') {
      const numValue = parseInt(value);
      if (numValue < 1) return; // Ne pas permettre moins d'une personne
    }
    
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
    
    if (!formData.location.trim()) {
      newErrors.location = 'L\'emplacement est requis';
    }
    
    if (!formData.personsInHouse || formData.personsInHouse < 1) {
      newErrors.personsInHouse = 'Le nombre de personnes doit être d\'au moins 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Créer une copie pour ne pas modifier directement l'état
      const submissionData = { ...formData };
      
      // S'assurer que personsInHouse est un nombre
      submissionData.personsInHouse = parseInt(submissionData.personsInHouse);
      
      // S'assurer que l'ID est préservé en mode édition
      if (item && item._id) {
        submissionData._id = item._id;
      }
      
      onSubmit(submissionData);
    }
  };

  // Traduire la taille de maison pour l'affichage
  const getHouseSizeLabel = (size) => {
    const sizes = {
      'small': 'Petite (1-2 personnes)',
      'medium': 'Moyenne (3-4 personnes)',
      'big': 'Grande (5+ personnes)'
    };
    return sizes[size] || size;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium text-gray-800 mb-6">
        {item && item._id ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Emplacement/Pays */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Emplacement/Pays*
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="ex: France, Italie, Japon..."
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.location ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>
        
        {/* Nombre de personnes */}
        <div>
          <label htmlFor="personsInHouse" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de personnes*
          </label>
          <input
            type="number"
            id="personsInHouse"
            name="personsInHouse"
            min="1"
            value={formData.personsInHouse}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.personsInHouse ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.personsInHouse && <p className="mt-1 text-sm text-red-600">{errors.personsInHouse}</p>}
        </div>
        
        {/* Taille de la maison (en lecture seule) */}
        <div>
          <label htmlFor="houseSize" className="block text-sm font-medium text-gray-700 mb-1">
            Taille du logement (déterminée automatiquement)
          </label>
          <div className="flex items-center">
            <div 
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 sm:text-sm"
            >
              {getHouseSizeLabel(formData.houseSize)}
            </div>
            <input type="hidden" name="houseSize" value={formData.houseSize} />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            La taille du logement est automatiquement déterminée en fonction du nombre de personnes.
          </p>
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

export default UserForm;