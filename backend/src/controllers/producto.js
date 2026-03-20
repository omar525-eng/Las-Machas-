import {insertarProducto, obtenerTodosProductos, actualizarProductoDB, eliminarProductoDB} from "../models/producto.js"

// Crear
export const crearProducto = async (req, res) => {
  try {
    await insertarProducto(req.body)

    res.json({ message: "Producto creado" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Obtener
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await obtenerTodosProductos()

    res.json({ data: productos })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Actualizar
export const actualizarProducto = async (req, res) => {
  try {
    await actualizarProductoDB(req.params.id, req.body)

    res.json({ message: "Producto actualizado" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Eliminar
export const eliminarProducto = async (req, res) => {
  try {
    await eliminarProductoDB(req.params.id)

    res.json({ message: "Producto eliminado" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}