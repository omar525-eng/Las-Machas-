import { insertarPedido, obtenerTodosPedidos } from "../models/pedido.js"

// GET /api/pedidos
export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await obtenerTodosPedidos()

    res.json({
      message: "Lista de pedidos",
      data: pedidos
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/pedidos
export const crearPedido = async (req, res) => {
  try {
    const pedido = req.body

    await insertarPedido(pedido)

    res.json({
      message: "Pedido creado correctamente",
      data: pedido
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}