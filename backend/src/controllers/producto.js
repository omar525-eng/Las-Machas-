import { actualizarProducto, obtenerDetalleProducto } from "../models/producto.js"

// PUT /api/productos/:id
export const updateProducto = async (req, res) => {
  try {
    const producto = {
      ProductoID: req.params.id,
      ...req.body
    }

    await actualizarProducto(producto)

    res.json({ message: "Producto actualizado correctamente" })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET /api/productos/:id
export const getDetalleProducto = async (req, res) => {
  try {
    const data = await obtenerDetalleProducto(req.params.id)

    res.json({
      message: "Detalle del producto",
      data
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}