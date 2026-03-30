import { getConnection } from '../config/db.js';

// Buscar usuario por correo
export async function findUserByEmail(correo) {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input('Correo', sql.VarChar(100), correo)
      .query('SELECT UsuarioID, Correo, PasswordHash, RolID FROM Usuarios WHERE Correo = @Correo AND Activo = 1');

    return result.recordset[0]; // primer usuario encontrado
  } catch (error) {
    console.error('Error en findUserByEmail:', error);
    throw error;
  }
}

// Registrar usuario
export async function registrarUsuario(rol, nombreCompleto, correo, passwordHash, telefono, direccionDefecto) {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input('Rol', sql.VarChar(50), rol)
      .input('NombreCompleto', sql.VarChar(150), nombreCompleto)
      .input('Correo', sql.VarChar(100), correo)
      .input('PasswordHash', sql.VarChar(255), passwordHash)
      .input('Telefono', sql.VarChar(20), telefono)
      .input('DireccionDefecto', sql.VarChar(255), direccionDefecto)
      .execute('sp_RegistrarUsuario');

    return result.recordset[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Actualizar usuario
export async function actualizarUsuario(usuarioID, nombreCompleto, telefono, direccionDefecto) {
  try {
    const pool = await getConnection();

    await pool.request()
      .input('UsuarioID', usuarioID)
      .input('NombreCompleto', nombreCompleto)
      .input('Telefono', telefono)
      .input('DireccionDefecto', direccionDefecto)
      .execute('sp_ActualizarUsuario');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Obtener usuario por ID
export const obtenerUsuario = async (usuarioID) => {
  const pool = await getConnection()

  const result = await pool.request()
    .input("UsuarioID", usuarioID)
    .execute("sp_ObtenerUsuario")

  return result.recordset[0] // solo un usuario
}