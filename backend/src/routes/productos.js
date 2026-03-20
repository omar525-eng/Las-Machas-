import express from "express"
import { crearProducto, obtenerProductos, actualizarProducto, eliminarProducto } from "../controllers/producto.js"

const router = express.Router()

router.post("/", crearProducto)
router.get("/", obtenerProductos)
router.put("/:id", actualizarProducto)
router.delete("/:id", eliminarProducto)

export default router