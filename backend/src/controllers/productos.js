import { getConnection } from "../config/db.js"

// Crear
export const crearProducto = async (req, res) => {
  try {
    const pool = await getConnection()
    await pool.request()
      .input("nombre", req.body.nombre)
      .input("precio", req.body.precio)
      .input("stock", req.body.stock)
      .query("INSERT INTO Productos (nombre, precio, stock) VALUES (@nombre, @precio, @stock)")
    res.json({ message: "Producto creado" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// READ
export const obtenerProductos = async (req, res) => {
  try {
    const pool = await getConnection()
    const result = await pool.request().query("SELECT * FROM Productos")
    res.json(result.recordset)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// actualizar
export const actualizarProducto = async (req, res) => {
  try {
    const pool = await getConnection()
    await pool.request()
      .input("id", req.params.id)
      .input("nombre", req.body.nombre)
      .input("precio", req.body.precio)
      .input("stock", req.body.stock)
      .query("UPDATE Productos SET nombre=@nombre, precio=@precio, stock=@stock WHERE id=@id")
    res.json({ message: "Producto actualizado" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
//BORRAR
export const eliminarProducto = async (req, res) => {
  try {
    const pool = await getConnection();
    await pool.request()
      .input("id", req.params.id)
      .query("DELETE FROM Productos WHERE id=@id")
    res.json({ message: "Producto eliminado" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}