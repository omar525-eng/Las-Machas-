import express from "express"
import { updateProducto, getDetalleProducto } from "../controllers/producto.js"

const router = express.Router()

router.put("/:id", updateProducto)
router.get("/:id", getDetalleProducto)

export default router