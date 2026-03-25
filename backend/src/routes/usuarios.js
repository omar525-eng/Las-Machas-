import express from 'express';
import { registrarUsuario,} from '../controllers/user.js';
import { login} from '../controllers/authController.js';
const router = express.Router();

router.post('/registrar', registrarUsuario);
router.post('/login', login);

export default router;