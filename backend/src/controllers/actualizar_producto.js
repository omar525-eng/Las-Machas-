import { actualizarProducto } from "../models/producto.js"
import { actualizarSKU } from "../models/skus.js"

// endpoint combinado
export const actualizar_producto = async (req, res) => {
  try {
    const producto = {
      ProductoID: req.params.id,
      Nombre: req.body.Nombre,
      CategoriaID: req.body.CategoriaID,
      ImagenURL: req.body.ImagenURL,
      Estado: req.body.Estado,
      Descripcion: req.body.Descripcion
    }

    const sku = {
      SkuID: req.body.SkuID,
      Tamano: req.body.Tamano,
      PrecioRegular: req.body.PrecioRegular,
      PrecioMayoreo: req.body.PrecioMayoreo,
      Stock: req.body.Stock,
      StockMinimo: req.body.StockMinimo
    }

    // ejecutas ambos SP
    await actualizarProducto(producto)
    await actualizarSKU(sku)

    res.json({
      message: "Producto y SKU actualizados correctamente"
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}