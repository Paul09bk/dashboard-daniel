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

// Nouvelle fonction pour récupérer les statistiques du dashboard
export const fetchDashboardStats = async () => {
  try {
    // Récupérer à la fois les capteurs et les utilisateurs
    const [sensors, users] = await Promise.all([
      fetchSensors(),
      fetchUsers()
    ]);
    
    // Retourner les statistiques
    return {
      capteurs: sensors.length,
      utilisateurs: users.length,
      date: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques du dashboard:', error);
    throw error;
  }
};

// Mise à jour de fetchDetailedMeasures
export const fetchDetailedMeasures = async (sensorId) => {
  try {
    // D'abord récupérer les mesures pour le capteur spécifié
    const measures = await fetchMeasures({ sensorID: sensorId });
    
    // Ensuite récupérer les détails du capteur
    const sensorResponse = await fetch(`${API_BASE_URL}/sensors/${sensorId}`);
    if (!sensorResponse.ok) {
      throw new Error(`Erreur HTTP: ${sensorResponse.status}`);
    }
    const sensorDetails = await sensorResponse.json();
    
    // Enrichir chaque mesure avec les détails du capteur
    return measures.map(measure => {
      // Extraire l'ID réel du capteur si c'est un objet MongoDB
      const actualSensorId = measure.sensorID && measure.sensorID.$oid 
        ? measure.sensorID.$oid 
        : (typeof measure.sensorID === 'string' ? measure.sensorID : sensorId);
      
      return {
        ...measure,
        // Utiliser les champs existants ou ajouter des valeurs par défaut
        sensorID: actualSensorId,
        sensorType: measure.type || sensorDetails.type || "Non spécifié",
        timestamp: measure.creationDate || measure.timestamp || measure.date,
        sensorLocation: sensorDetails.location || "Lieu inconnu"
      };
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération des mesures détaillées pour le capteur ${sensorId}:`, error);
    
    // En cas d'erreur, retourner les mesures avec un enrichissement minimal
    const measures = await fetchMeasures({ sensorID: sensorId });
    return measures.map(measure => ({
      ...measure,
      sensorID: measure.sensorID || sensorId,
      sensorType: measure.type || "Non spécifié",
      timestamp: measure.creationDate || measure.timestamp || measure.date,
      sensorLocation: "Lieu inconnu"
    }));
  }
};