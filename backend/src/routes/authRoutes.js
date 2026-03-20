const express = require('express');
const { login } = require('../controllers/authController');
const { register } = require('../controllers/authController'); // opcional si agregas registro
const router = express.Router();

// Ruta de login
router.post('/login', login);

// Ruta de registro (opcional)
router.post('/register', register);

module.exports = router;