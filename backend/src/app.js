import express from "express"
import cors from "cors"

// Importar rutas
import productosRoutes from "./src/routes/productos.js"
import pedidosRoutes from "./src/routes/pedidos.js"
import skusRoutes from "./src/routes/skus.js"

const app = express()

// Middlewares globales
app.use(cors())
app.use(express.json())

// Rutas principales
app.use("/api/productos", productosRoutes)
app.use("/api/pedidos", pedidosRoutes)
app.use("/api/skus", skusRoutes)

// Servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`)
})