import { actualizarSKU } from "../models/skus.js"

// PUT /api/skus/:id
export const updateSKU = async (req, res) => {
  try {
    const sku = {
      SkuID: req.params.id,
      ...req.body
    }

    await actualizarSKU(sku)

    res.json({ message: "SKU actualizado correctamente" })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}