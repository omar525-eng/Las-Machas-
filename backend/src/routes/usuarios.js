import express from 'express';
import { registrarUsuarioController, actualizarUsuarioController } from '../controllers/user.js';
import { login } from '../controllers/authController.js';
const router = express.Router();

router.post('/registrar', registrarUsuarioController);
router.post('/login', login);
router.put('/:id', actualizarUsuarioController);

export default router;