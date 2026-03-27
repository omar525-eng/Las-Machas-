import bcrypt from 'bcrypt';
import { registrarUsuario as registrarUsuarioModel } from '../models/userM.js';

// Registrar usuario
export async function registrarUsuario(req, res) {
  try {
    const { rol, nombreCompleto, correo, password, telefono, direccionDefecto } = req.body;

    // Hash del password
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await registrarUsuarioModel({
      rol,
      nombreCompleto,
      correo,
      passwordHash,
      telefono,
      direccionDefecto
    });

    if (result.UsuarioID === -1) {
      return res.status(400).json({ error: result.Mensaje });
    }

    res.status(201).json({ usuarioId: result.UsuarioID, mensaje: result.Mensaje });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor.' });
  }
}

