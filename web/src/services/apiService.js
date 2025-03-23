// web/src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:31356';

// Gestion générique des erreurs pour toutes les requêtes API
const handleApiError = (error, entityName) => {
  let errorMessage = `Une erreur est survenue lors de l'opération sur ${entityName}`;
  
  if (error.response) {
    // La requête a été faite et le serveur a répondu avec un code d'état hors de la plage 2xx
    errorMessage = `Erreur ${error.response.status}: ${error.response.data.error || error.response.statusText}`;
    console.error('Erreur API - Réponse:', error.response.data);
  } else if (error.request) {
    // La requête a été faite mais aucune réponse n'a été reçue
    errorMessage = "Le serveur ne répond pas. Vérifiez votre connexion ou contactez l'administrateur.";
    console.error('Erreur API - Pas de réponse:', error.request);
  } else {
    // Une erreur s'est produite lors de la configuration de la requête
    console.error('Erreur API:', error.message);
  }
  
  // On retourne une erreur formatée pour faciliter le traitement
  const formattedError = new Error(errorMessage);
  formattedError.originalError = error;
  throw formattedError;
};

// =============== FONCTIONS EXISTANTES ===============

export const fetchSensors = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sensors`);
    if (!response.ok && !response.data) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des capteurs:', error);
    throw handleApiError(error, 'capteurs');
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    if (!response.ok && !response.data) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw handleApiError(error, 'utilisateurs');
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
    
    const response = await axios.get(url);
    if (!response.ok && !response.data) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des mesures:', error);
    throw handleApiError(error, 'mesures');
  }
};

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
      const user = usersMap.get(sensor.userId || sensor.userID);
      
      return {
        ...sensor,
        userLocation: user ? user.location : null,
        personsInHouse: user ? user.personsInHouse : 0,
        houseSize: user ? user.houseSize : 'medium'
      };
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des localisations des capteurs:', error);
    throw handleApiError(error, 'localisations des capteurs');
  }
};

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
    throw handleApiError(error, 'statistiques');
  }
};

export const fetchDetailedMeasures = async (sensorId) => {
  try {
    // D'abord récupérer les mesures pour le capteur spécifié
    const measures = await fetchMeasures({ sensorID: sensorId });
    
    // Ensuite récupérer les détails du capteur
    const sensorResponse = await axios.get(`${API_BASE_URL}/sensors/${sensorId}`);
    if (!sensorResponse.ok && !sensorResponse.data) {
      throw new Error(`Erreur HTTP: ${sensorResponse.status}`);
    }
    const sensorDetails = sensorResponse.data;
    
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
    try {
      const measures = await fetchMeasures({ sensorID: sensorId });
      return measures.map(measure => ({
        ...measure,
        sensorID: measure.sensorID || sensorId,
        sensorType: measure.type || "Non spécifié",
        timestamp: measure.creationDate || measure.timestamp || measure.date,
        sensorLocation: "Lieu inconnu"
      }));
    } catch (innerError) {
      console.error('Erreur lors de la récupération des mesures de base:', innerError);
      throw handleApiError(innerError, 'mesures détaillées');
    }
  }
};

// =============== NOUVELLES FONCTIONS ADMIN ===============

// Fonctions CRUD génériques

export const fetchEntities = async (entityType) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${entityType}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, entityType);
  }
};

export const fetchEntityById = async (entityType, id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${entityType}/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `${entityType} (ID: ${id})`);
  }
};

export const createEntity = async (entityType, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${entityType}`, data);
    return response.data;
  } catch (error) {
    return handleApiError(error, `création de ${entityType}`);
  }
};

export const updateEntity = async (entityType, id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${entityType}/${id}`, data);
    return response.data;
  } catch (error) {
    return handleApiError(error, `mise à jour de ${entityType} (ID: ${id})`);
  }
};

export const deleteEntity = async (entityType, id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${entityType}/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `suppression de ${entityType} (ID: ${id})`);
  }
};

// Fonctions spécifiques pour les utilisateurs

export const fetchUserWithSensors = async (userId) => {
  try {
    // Récupérer les informations de l'utilisateur
    const user = await fetchEntityById('users', userId);
    
    // Récupérer tous les capteurs
    const sensors = await fetchEntities('sensors');
    
    // Filtrer les capteurs qui appartiennent à cet utilisateur
    const userSensors = sensors.filter(sensor => 
      sensor.userID === userId || 
      (sensor.userId && sensor.userId === userId)
    );
    
    // Ajouter les capteurs aux détails de l'utilisateur
    return {
      ...user,
      sensors: userSensors
    };
  } catch (error) {
    return handleApiError(error, `utilisateur avec capteurs (ID: ${userId})`);
  }
};

// Fonctions spécifiques pour les capteurs

export const fetchSensorWithMeasures = async (sensorId) => {
  try {
    // Récupérer les informations du capteur
    const sensor = await fetchEntityById('sensors', sensorId);
    
    // Récupérer les mesures liées à ce capteur
    const measures = await fetchEntities('measures/filter?sensorID=' + sensorId);
    
    // Ajouter les mesures aux détails du capteur
    return {
      ...sensor,
      measures: measures
    };
  } catch (error) {
    return handleApiError(error, `capteur avec mesures (ID: ${sensorId})`);
  }
};

export const fetchSensorStats = async (sensorId) => {
  try {
    const measures = await fetchEntities('measures/filter?sensorID=' + sensorId);
    
    // Si pas de mesures, retourner des stats vides
    if (!measures || measures.length === 0) {
      return {
        count: 0,
        average: null,
        min: null,
        max: null,
        latest: null
      };
    }
    
    // Calculer des statistiques de base
    const values = measures.map(m => m.value).filter(v => !isNaN(v));
    const latestMeasure = measures.sort((a, b) => 
      new Date(b.creationDate || b.timestamp) - new Date(a.creationDate || a.timestamp)
    )[0];
    
    return {
      count: measures.length,
      average: values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : null,
      min: values.length > 0 ? Math.min(...values) : null,
      max: values.length > 0 ? Math.max(...values) : null,
      latest: latestMeasure
    };
  } catch (error) {
    return handleApiError(error, `statistiques du capteur (ID: ${sensorId})`);
  }
};

// Exportation de toutes les fonctions
export default {
  // Fonctions existantes
  fetchSensors,
  fetchUsers,
  fetchMeasures,
  fetchSensorLocations,
  fetchDashboardStats,
  fetchDetailedMeasures,
  
  // Nouvelles fonctions admin
  fetchEntities,
  fetchEntityById,
  createEntity,
  updateEntity,
  deleteEntity,
  fetchUserWithSensors,
  fetchSensorWithMeasures,
  fetchSensorStats
};