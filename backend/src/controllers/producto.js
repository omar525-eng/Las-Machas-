import { actualizarProducto, obtenerDetalleProducto, crearProducto } from "../models/producto.js"

// PUT /api/productos/:id
export const updateProducto = async (req, res) => {
  try {
    const data = req.body

    const producto = {
      ProductoID: req.params.id,
      Nombre: data.Nombre,
      CategoriaID: data.CategoriaID,
      ImagenURL: data.ImagenURL,
      Estado: data.Estado ?? 1, // 🔥 ahora coincide con el SP
      Descripcion: data.Descripcion
    }

    await actualizarProducto(producto)

    res.json({ message: "Producto actualizado correctamente" })

  } catch (error) {
    console.error(error)
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
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

// POST /api/productos
export const postProducto = async (req, res) => {
  try {
    const data = req.body

    const producto = {
      Nombre: data.Nombre,
      CategoriaID: data.CategoriaID,
      ImagenURL: data.ImagenURL,
      Estado: data.Estado ?? 1, 
      Descripcion: data.Descripcion
    }

    const nuevoID = await crearProducto(producto)

    res.json({
      message: "Producto creado correctamente",
      productoID: nuevoID
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}