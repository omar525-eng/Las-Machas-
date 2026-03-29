import { getConnection } from "../config/db.js"

// Actualizar SKU
export const actualizarSKU = async (sku) => {
  const pool = await getConnection()

  await pool.request()
    .input("SkuID", sku.SkuID)
    .input("Tamano", sku.Tamano)
    .input("PrecioRegular", sku.PrecioRegular)
    .input("PrecioMayoreo", sku.PrecioMayoreo)
    .input("Stock", sku.Stock)
    .input("StockMinimo", sku.StockMinimo)
    .input("SkuEstado", sku.Estado) // corresponde al SP
    .execute("sp_ActualizarSKU")
}