import { getConnection } from "../config/db.js"

export const obtenerInventarioInactivo = async () => {
  const pool = await getConnection()

  const result = await pool.request()
    .execute("sp_ObtenerInventarioInactivo")

  return result.recordset
}