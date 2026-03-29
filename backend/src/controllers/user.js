import bcrypt from 'bcrypt';
import { registrarUsuario, actualizarUsuario } from '../models/userM.js';

// POST /api/usuarios/registrar
export async function registrarUsuarioController(req, res) {
  try {
    const { rol, nombreCompleto, correo, password, telefono, direccionDefecto } = req.body;

    // Hash del password
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await registrarUsuario(rol, nombreCompleto, correo, passwordHash, telefono, direccionDefecto);

    if (result.UsuarioID === -1) {
      return res.status(400).json({ error: result.Mensaje });
    }

    res.status(201).json({ usuarioId: result.UsuarioID, mensaje: result.Mensaje });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor.' });
  }
}

// PUT /api/usuarios/:id
export async function actualizarUsuarioController(req, res) {
  try {
    const id = req.params.id;
    const { NombreCompleto, Telefono, DireccionDefecto } = req.body;

    await actualizarUsuario(id, NombreCompleto, Telefono, DireccionDefecto);

    res.json({ mensaje: 'Usuario actualizado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
}