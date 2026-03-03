import express from "express"
import productosRoutes from "./routes/productos.js"

const app = express()
app.use(express.json())

// Rutas
app.use("/api", productosRoutes)

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
})