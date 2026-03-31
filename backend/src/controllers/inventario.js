import { obtenerInventarioInactivo } from "../models/inventario.js"

export const getInventarioInactivo = async (req, res) => {
  try {
    const data = await obtenerInventarioInactivo()

    res.json({
      message: "Inventario inactivo obtenido",
      data
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}