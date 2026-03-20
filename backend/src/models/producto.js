import { getConnection } from "../config/db.js"

// Crear
export const insertarProducto = async (producto) => {
  const pool = await getConnection()

  await pool.request()
    .input("nombre", producto.nombre)
    .input("precio", producto.precio)
    .input("stock", producto.stock)
    .query(`
      INSERT INTO Productos (nombre, precio, stock)
      VALUES (@nombre, @precio, @stock)
    `)
}

// Obtener
export const obtenerTodosProductos = async () => {
  const pool = await getConnection()

  const result = await pool.request()
    .query("SELECT * FROM Productos")

  return result.recordset
}

// Actualizar
export const actualizarProductoDB = async (id, producto) => {
  const pool = await getConnection()

  await pool.request()
    .input("id", id)
    .input("nombre", producto.nombre)
    .input("precio", producto.precio)
    .input("stock", producto.stock)
    .query(`
      UPDATE Productos
      SET nombre=@nombre, precio=@precio, stock=@stock
      WHERE id=@id
    `)
}

// Eliminar
export const eliminarProductoDB = async (id) => {
  const pool = await getConnection()

  await pool.request()
    .input("id", id)
    .query("DELETE FROM Productos WHERE id=@id")
}