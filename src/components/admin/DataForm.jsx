import { useState, useEffect } from 'react';

const DataForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({});
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    // Add validation logic based on your data model
    // Example:
    Object.keys(formData).forEach(key => {
      if (formData[key] === '' || formData[key] === null) {
        newErrors[key] = 'This field is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-lg font-medium text-gray-800 mb-6">
        {item && item._id ? 'Edit Item' : 'Add New Item'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.keys(formData).map(key => {
          // Skip internal fields like _id, __v, etc.
          if (key === '_id' || key === '__v' || key === 'createdAt' || key === 'updatedAt') {
            return null;
          }
          
          return (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="text"
                id={key}
                name={key}
                value={formData[key] || ''}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors[key] ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors[key] && (
                <p className="mt-1 text-sm text-red-600">{errors[key]}</p>
              )}
            </div>
          );
        })}
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {item && item._id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataForm;