import express from "express"
import { crearProducto, obtenerProductos, actualizarProducto, eliminarProducto } from "../controllers/productos.js"

const router = express.Router()

router.post("/productos", crearProducto)
router.get("/productos", obtenerProductos)
router.put("/productos/:id", actualizarProducto)
router.delete("/productos/:id", eliminarProducto)

export default router