import { getConnection } from "../config/db.js"

// Crear pedido
export const insertarPedido = async (pedido) => {
  const pool = await getConnection()

  const result = await pool.request()
    .input("UsuarioID", pedido.UsuarioID || null)
    .input("ClienteNombre", pedido.ClienteNombre)
    .input("ClienteTelefono", pedido.ClienteTelefono)
    .input("ClienteDireccion", pedido.ClienteDireccion)
    .input("CarritoJSON", JSON.stringify(pedido.detalles))
    .execute("sp_CrearPedido")

  return result.recordsets
}

// Obtener TODOS los pedidos usando SP
export const obtenerTodosPedidos = async () => {
  const pool = await getConnection()

  const result = await pool.request()
    .execute("sp_ObtenerPedidos")

  return result.recordset
}

// Obtener detalle de pedido
export const obtenerDetallePedido = async (pedidoID) => {
  const pool = await getConnection()

  const result = await pool.request()
    .input("PedidoID", pedidoID)
    .execute("sp_ObtenerDetallePedido")

  return result.recordset
}