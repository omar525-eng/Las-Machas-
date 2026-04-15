import { getConnection } from "../config/db.js"

// Actualizar producto
export const actualizarProducto = async (producto) => {
  const pool = await getConnection()
  await pool.request()
    .input("ProductoID", producto.ProductoID)
    .input("Nombre", producto.Nombre)
    .input("CategoriaID", producto.CategoriaID)
    .input("ImagenURL", producto.ImagenURL)
    .input("Estado", producto.Estado) // 🔥 ahora correcto
    .input("Descripcion", producto.Descripcion)
    .execute("sp_ActualizarProducto")
}

// Obtener detalle producto
export const obtenerDetalleProducto = async (productoID) => {
  const pool = await getConnection()

  const result = await pool.request()
    .input("ProductoID", productoID)
    .execute("sp_ObtenerDetalleProducto")

  return {
    producto: result.recordsets[0][0],
    skus: result.recordsets[1]
  }
}

// Crear producto
export const crearProducto = async (producto) => {
  const pool = await getConnection()

  const result = await pool.request()
    .input("Nombre", producto.Nombre)
    .input("CategoriaID", producto.CategoriaID)
    .input("ImagenURL", producto.ImagenURL)
    .input("Estado", producto.Estado)
    .input("Descripcion", producto.Descripcion)
    .execute("sp_CrearProducto")

  return result.recordset[0].NuevoProductoID 
}