import { getConnection } from "../config/db.js"

// Crear SKU
export const crearSKU = async (sku) => {
  const pool = await getConnection()

  await pool.request()
    .input("ProductoID",     sku.ProductoID)
    .input("Tamano",         sku.Tamano)
    .input("PrecioRegular",  sku.PrecioRegular)
    .input("PrecioMayoreo",  sku.PrecioMayoreo)
    .input("Stock",          sku.Stock)
    .input("StockMinimo",    sku.StockMinimo)
    .input("Estado",         sku.Estado)
    .execute("sp_CrearSKU")
}

// Actualizar SKU
export const actualizarSKU = async (sku) => {
  const pool = await getConnection()

  await pool.request()
    .input("SkuID",          sku.SkuID)
    .input("Tamano",         sku.Tamano)
    .input("PrecioRegular",  sku.PrecioRegular)
    .input("PrecioMayoreo",  sku.PrecioMayoreo)
    .input("Stock",          sku.Stock)
    .input("StockMinimo",    sku.StockMinimo)
    .execute("sp_ActualizarSKU")
}

// Cambiar estado de SKU
export const cambiarEstadoSKU = async (skuID, estado) => {
  const pool = await getConnection()

  await pool.request()
    .input("SkuID", skuID)
    .input("Estado", estado)
    .execute("sp_CambiarEstadoSKU")
} 