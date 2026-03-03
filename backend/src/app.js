const express = require("express")
const cors = require("cors")
const sql = require("mssql")

const app = express()
app.use(cors())
app.use(express.json())

// Configuración de la base de datos (Azure SQL)
const dbConfig = {
  user: "server-ornelasomar-machasDB",
  password: "LasMachas12345+",
  database: "MachasDB",
  server: "server-machascloud-omar.database.windows.net",
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
}

// Función para obtener conexión
const getConnection = async () => {
  try {
    const pool = await sql.connect(dbConfig)
    return pool
  } catch (error) {
    console.error("Error de conexión DB:", error)
    throw error
  }
}

// Inventario en memoria (ejemplo)
const skuInventario = [
  {
    SkuID: 1,
    ProductoID: 1,
    Tamano: "250ml",
    PrecioRegular: 50,
    PrecioMayoreo: 50,
    Stock: 5
  },
  {
    SkuID: 2,
    ProductoID: 1,
    Tamano: "500ml",
    PrecioRegular: 95,
    PrecioMayoreo: 85,
    Stock: 15
  }
]

const pedidos = []
const detallePedidos = []
let contadorPedidoID = 1

// Endpoint para procesar pedido
app.post("/api/procesar-pedido", (req, res) => {
  try {
    const { UsuarioID, ClienteNombre, ClienteTelefono, ClienteDireccion, items } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({
        exito: false,
        mensaje: "El pedido no tiene items"
      })
    }

    const total500ml = items
      .filter(i => i.Tamano === "500ml")
      .reduce((acc, i) => acc + i.Cantidad, 0)

    const aplicarMayoreo = total500ml > 10

    let totalCalculado = 0
    const detalles = []

    for (const item of items) {
      const sku = skuInventario.find(s => s.SkuID === item.SkuID)

      if (!sku) {
        return res.status(400).json({
          exito: false,
          mensaje: `SKU ${item.SkuID} no existe`
        })
      }

      let precioUnitario = sku.PrecioRegular
      if (item.Tamano === "500ml" && aplicarMayoreo) {
        precioUnitario = sku.PrecioMayoreo
      }

      const subtotal = precioUnitario * item.Cantidad
      totalCalculado += subtotal

      detalles.push({
        PedidoID: contadorPedidoID,
        SkuID: item.SkuID,
        Cantidad: item.Cantidad,
        PrecioUnitarioAplicado: precioUnitario
      })
    }

    const folio = "MC-" + String(contadorPedidoID).padStart(4, "0")

    const pedido = {
      PedidoID: contadorPedidoID,
      FolioCorto: folio,
      UsuarioID,
      FechaCreacion: new Date(),
      ClienteNombre,
      ClienteTelefono,
      ClienteDireccion,
      Total: totalCalculado,
      Estatus: "Pendiente"
    }

    pedidos.push(pedido)
    detallePedidos.push(...detalles)
    contadorPedidoID++

    const mensaje = `Hola quiero confirmar mi pedido ${folio}`
    const whatsappLink = `https://wa.me/3461056351?text=${encodeURIComponent(mensaje)}`

    return res.json({
      exito: true,
      mensaje: "Pedido procesado correctamente",
      datosPedido: {
        FolioCorto: folio,
        TotalCalculado: totalCalculado,
        whatsappLink
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      exito: false,
      mensaje: "Error al procesar el pedido"
    })
  }
})

// Endpoints de consulta
app.get("/api/pedidos", (req, res) => {
  res.json(pedidos)
})

app.get("/api/detalle", (req, res) => {
  res.json(detallePedidos)
})

app.get("/api/skus", (req, res) => {
  res.json(skuInventario)
})

// Ejemplo de endpoint conectado a SQL Server
app.get("/api/recursos", async (req, res) => {
  try {
    const pool = await getConnection()
    const result = await pool.request().query("SELECT * FROM Recursos")
    res.json(result.recordset)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.listen(3000, () => {
  console.log("API corriendo en http://localhost:3000")
})