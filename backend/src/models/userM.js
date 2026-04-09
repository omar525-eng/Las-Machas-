import { getConnection } from '../config/db.js';

export async function findUserByEmail(correo) {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input('Correo', correo) 
      // 🔥 Usamos RolID AS Rol para no romper la base de datos y que el AuthController reciba lo que espera
      .query('SELECT UsuarioID, Correo, PasswordHash, RolID AS Rol FROM Usuarios WHERE Correo = @Correo AND Activo = 1');

    return result.recordset[0]; 
  } catch (error) {
    console.error('Error en findUserByEmail:', error);
    throw error;
  }
}

export async function registrarUsuario(rol, nombreCompleto, correo, passwordHash, telefono, direccionDefecto) {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("Rol",              rol)
      .input("NombreCompleto",   nombreCompleto)
      .input("Correo",           correo)
      .input("PasswordHash",     passwordHash)
      .input("Telefono",         telefono)
      .input("DireccionDefecto", direccionDefecto)
      .execute("sp_RegistrarUsuario");

    return result.recordset[0];
  } catch (error) {
    console.error("Error al registrar:", error);
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

  return result.recordset[0] 
}