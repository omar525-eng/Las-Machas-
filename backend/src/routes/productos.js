import express from "express"
import { updateProducto, getDetalleProducto, postProducto } from "../controllers/producto.js"

const router = express.Router()

router.put("/:id", updateProducto)
router.get("/:id", getDetalleProducto)
router.post("/", postProducto)

export default router