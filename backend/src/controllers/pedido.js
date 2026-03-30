import { insertarPedido, obtenerTodosPedidos, obtenerDetallePedido } from "../models/pedido.js"
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

// GET /api/pedidos/:id
export const getDetallePedido = async (req, res) => {
  try {
    const id = req.params.id

    const data = await obtenerDetallePedido(id)

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Pedido no encontrado"
      })
    }

    // Obtener detalle pedido
    const cabecera = {
      PedidoID: data[0].PedidoID,
      FolioCorto: data[0].FolioCorto,
      FechaCreacion: data[0].FechaCreacion,
      ClienteNombre: data[0].ClienteNombre,
      ClienteTelefono: data[0].ClienteTelefono,
      ClienteDireccion: data[0].ClienteDireccion,
      Estatus: data[0].Estatus
    }

    const detalle = data.map(item => ({
      DetalleID: item.DetalleID,
      NombreProducto: item.NombreProducto,
      Presentacion: item.Presentacion,
      Cantidad: item.Cantidad,
      PrecioUnitarioAplicado: item.PrecioUnitarioAplicado,
      SubtotalLinea: item.SubtotalLinea
    }))

    res.json({
      message: "Detalle del pedido",
      data: {
        cabecera,
        detalle
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}