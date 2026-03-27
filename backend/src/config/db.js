import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();
export const dbConfig = {
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
server: process.env.DB_SERVER,
port: 1433,
options: {
encrypt: true,
trustServerCertificate: false}
};

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Conexión exitosa a la base de datos");
    return pool;
  } catch (error) {
    console.error("Error de conexión DB:", error);
    throw error;
  }
};

// Ejecutar una prueba de conexión
getConnection();