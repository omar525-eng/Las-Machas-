import { getConnection } from "../config/db.js"

export const obtenerCatalogo = async () => {
  const pool = await getConnection()

  const result = await pool.request()
    .execute("sp_ObtenerCatalogo")

  return result.recordset
}