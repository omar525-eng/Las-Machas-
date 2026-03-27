import express from 'express';
import { login, register } from '../controllers/authController.js';

const router = express.Router();

// Ruta de login
router.post('/login', login);

// Ruta de registro
router.post('/register', register);

export default router;