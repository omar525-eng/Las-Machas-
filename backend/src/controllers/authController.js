import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../models/userM.js';

export async function login(req, res) {
  console.log('Entrando a login:');
  try {
    console.log('Datos recibidos:', req.body);
    const { correo, password } = req.body;
    console.log('Datos recibidos:', { correo, password: password ? '****' : null });
    // Validación de entrada
    if (!correo || !password) {
      return res.status(400).json({ error: 'Correo y contraseña requeridos.' });
    }
    console.log('Buscando user');
    // Buscar usuario en la base de datos
    const user = await findUserByEmail(correo);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    console.log('Usuario encontrado:', { id: user.UsuarioID, correo: user.Correo, rol: user.Rol });
    // Comparar contraseña con hash almacenado
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }
    console.log('Contraseña válida, generando token');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '****' : 'No definido');
    // Generar token JWT con rol
    const token = jwt.sign(
      { id: user.UsuarioID, role: user.Rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    console.log('Token generado:', token);
    // Respuesta al cliente
    res.json({
      token,
      role: user.Rol,
      id: user.UsuarioID,
      mensaje: 'Login exitoso'
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error del servidor.' });
  }
}