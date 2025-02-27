import express from 'express';
const router = express.Router();

// GET all users
router.get('/', (req, res) => {
  // Logique pour récupérer tous les utilisateurs
  res.send('Get all users');
});

// GET user by ID
router.get('/:id', (req, res) => {
  // Logique pour récupérer un utilisateur par son ID
  res.send(`Get user with ID: ${req.params.id}`);
});

// POST new user
router.post('/', (req, res) => {
  // Logique pour créer un nouvel utilisateur
  res.send('Create a new user');
});

export default router;