import { insertarPedido, obtenerTodosPedidos, obtenerDetallePedido, cambiarEstatusPedido } from "../models/pedido.js"

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
    
    console.log("📦 Pedido recibido:", JSON.stringify(pedido, null, 2))
    
    const resultado = await insertarPedido(pedido)
    
    console.log("📊 Resultado del SP:", JSON.stringify(resultado, null, 2))
    
    // Validar respuesta del SP
    if (resultado && resultado[0] && resultado[0].length > 0) {
      const respuestaExito = resultado[0][0]
      
      if (respuestaExito.Exito === 0) {
        return res.status(400).json({
          error: respuestaExito.MensajeError || "Error al crear el pedido"
        })
      }
      
      res.status(201).json({
        message: "Pedido creado correctamente",
        data: {
          PedidoID: respuestaExito.PedidoID,
          Folio: respuestaExito.Folio,
          mensaje: respuestaExito.Mensaje
        }
      })
    } else {
      res.status(400).json({ error: "Respuesta inesperada del servidor" })
    }
  } catch (error) {
    console.error("❌ Error en crearPedido:", error)
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

// PATCH /api/pedidos/:id/estatus
export const updateEstatusPedido = async (req, res) => {
  try {
    const id = req.params.id
    const { Estatus } = req.body

    const data = await cambiarEstatusPedido(id, Estatus)

    res.json({
      message: "Estatus actualizado correctamente",
      data
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}