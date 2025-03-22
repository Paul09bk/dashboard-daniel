// web/src/services/apiService.js
const API_BASE_URL = 'http://localhost:31356'; // Ajustez selon votre configuration

export const fetchSensors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sensors`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des capteurs:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};

export const fetchMeasures = async (filters = {}) => {
  try {
    // Construire l'URL avec les filtres
    let url = `${API_BASE_URL}/measures`;
    
    // Si des filtres sont fournis, utiliser l'endpoint /filter
    if (Object.keys(filters).length > 0) {
      const params = new URLSearchParams();
      
      if (filters.type) params.append('type', filters.type);
      if (filters.sensorID) params.append('sensorID', filters.sensorID);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.minValue) params.append('minValue', filters.minValue);
      if (filters.maxValue) params.append('maxValue', filters.maxValue);
      
      url = `${API_BASE_URL}/measures/filter?${params.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des mesures:', error);
    throw error;
  }
};

// Fonction qui combine les données des capteurs et des utilisateurs
export const fetchSensorLocations = async () => {
  try {
    // Récupérer à la fois les capteurs et les utilisateurs
    const [sensors, users] = await Promise.all([
      fetchSensors(),
      fetchUsers()
    ]);
    
    // Créer une Map pour un accès rapide aux utilisateurs par ID
    const usersMap = new Map();
    users.forEach(user => {
      usersMap.set(user._id, user);
    });
    
    // Associer chaque capteur à son utilisateur pour obtenir la localisation
    return sensors.map(sensor => {
      const user = usersMap.get(sensor.userId);
      
      return {
        ...sensor,
        userLocation: user ? user.location : null,
        personsInHouse: user ? user.personsInHouse : 0,
        houseSize: user ? user.houseSize : 'medium'
      };
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des localisations des capteurs:', error);
    throw error;
  }
};