import { crearSKU, actualizarSKU, cambiarEstadoSKU } from "../models/skus.js"

export const createSKU = async (req, res) => {
  try {
    await crearSKU(req.body)
    res.status(201).json({ message: "SKU creado correctamente" })
  } catch (error) {
    res.status(500).json({ message: "Error al crear SKU", error: error.message })
  }
}

export const updateSKU = async (req, res) => {
  try {
    await actualizarSKU({ SkuID: req.params.id, ...req.body })
    res.status(200).json({ message: "SKU actualizado correctamente" })
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar SKU", error: error.message })
  }
}

export const updateEstadoSKU = async (req, res) => {
  try {
    const id = req.params.id
    const { Estado } = req.body

    await cambiarEstadoSKU(id, Estado)

    res.json({
      message: "Estado del SKU actualizado correctamente"
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}