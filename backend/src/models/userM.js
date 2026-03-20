const sql = require('mssql');
const dbConfig = require('../config/db'); // tu archivo de conexión

// Función para buscar usuario por email
async function findUserByEmail(email) {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT id, email, password, role FROM Users WHERE email = @email');

    return result.recordset[0]; // devuelve el primer usuario encontrado
  } catch (error) {
    console.error('Error en findUserByEmail:', error);
    throw error;
  }
}

// Función para registrar usuario (opcional)
async function createUser({ email, password, role }) {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, password) // ya debe venir encriptada
      .input('role', sql.VarChar, role)
      .query('INSERT INTO Users (email, password, role) VALUES (@email, @password, @role); SELECT SCOPE_IDENTITY() AS id;');

    return result.recordset[0];
  } catch (error) {
    console.error('Error en createUser:', error);
    throw error;
  }
}

module.exports = {
  findUserByEmail,
  createUser
};