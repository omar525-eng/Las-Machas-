import { getConnection } from "../config/db.js"

// Crear pedido
export const insertarPedido = async (pedido) => {
  const pool = await getConnection()

  // Mapeamos y CONVERTIMOS LOS TIPOS correctamente para SQL Server
  const detallesFormateados = (pedido.detalles || []).map(item => ({
    SkuID: parseInt(item.SkuID || item.skuID) || parseInt(item.id),  // Convertir a INT
    Cantidad: parseInt(item.cantidad || item.Cantidad),              // Convertir a INT
    Precio: parseFloat(item.precio || item.Precio)                   // Convertir a DECIMAL
  }));

  console.log("🛒 Pedido recibido del frontend:", JSON.stringify(pedido.detalles || [], null, 2))
  console.log("📋 Detalles FORMATEADOS para SQL:", JSON.stringify(detallesFormateados, null, 2))
  
  // Validar que hay detalles
  if (detallesFormateados.length === 0) {
    throw new Error("❌ El carrito está vacío. No se puede crear pedido sin productos.")
  }

  // Validar que todos los valores sean válidos
  const invalido = detallesFormateados.some(item => 
    isNaN(item.SkuID) || isNaN(item.Cantidad) || isNaN(item.Precio)
  );
  
  if (invalido) {
    console.error("❌ ERROR: Datos inválidos en el carrito:", detallesFormateados)
    throw new Error("Error: Algunos productos tienen datos inválidos.")
  }

  const resultado = await pool.request()
    .input("UsuarioID", pedido.UsuarioID || null)
    .input("ClienteNombre", pedido.ClienteNombre)
    .input("ClienteTelefono", pedido.ClienteTelefono)
    .input("ClienteDireccion", pedido.ClienteDireccion)
    .input("CarritoJSON", JSON.stringify(detallesFormateados))
    .execute("sp_CrearPedido")

  console.log("📊 Respuesta del SP:", JSON.stringify(resultado.recordsets, null, 2))
  console.log("✅ SP ejecutado correctamente")
  
  return resultado.recordsets
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

// Cambiar estatus de pedido
export const cambiarEstatusPedido = async (pedidoID, nuevoEstatus) => {
  const pool = await getConnection()

  const result = await pool.request()
    .input("PedidoID", pedidoID)
    .input("NuevoEstatus", nuevoEstatus)
    .execute("sp_CambiarEstatusPedido")

  return result.recordset[0] 
}