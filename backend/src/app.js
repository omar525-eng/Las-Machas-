import express from "express"
import cors from "cors"
import dotenv from 'dotenv';
dotenv.config();
// Importar rutas
import catalogoRoutes from "./routes/catalogos.js"
import pedidosRoutes from "./routes/pedidos.js"
import skusRoutes from "./routes/skus.js"
import productoRoutes from "./routes/productos.js"
import usuariosRoutes from './routes/usuarios.js';

const app = express()

// Middlewares globales
app.use(cors())
app.use(express.json())

// Rutas principales
app.use("/api/catalogos", catalogoRoutes)
app.use("/api/pedidos", pedidosRoutes)
app.use("/api/skus", skusRoutes)
app.use("/api/productos", productoRoutes)
app.use('/api/usuarios', usuariosRoutes);
// Servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`)
})