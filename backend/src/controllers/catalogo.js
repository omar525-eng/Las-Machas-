import { obtenerCatalogo } from "../models/catalogo.js"

export const getCatalogo = async (req, res) => {
  try {
    const catalogo = await obtenerCatalogo()

    res.json({
      message: "Catálogo obtenido correctamente",
      data: catalogo
    })

  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}