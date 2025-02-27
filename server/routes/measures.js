import express from 'express';
const router = express.Router();

// GET all measures
router.get('/', (req, res) => {
  // Logique pour récupérer toutes les mesures
  res.send('Get all measures');
});

// GET measure by ID
router.get('/:id', (req, res) => {
  // Logique pour récupérer une mesure par ID
  res.send(`Get measure with ID: ${req.params.id}`);
});

// POST new measure
router.post('/', (req, res) => {
  // Logique pour créer une nouvelle mesure
  res.send('Create a new measure');
});

export default router;