import express from "express"
import { actualizar_producto } from "../controllers/actualizar_producto.js"

const router = express.Router()

router.put("/actualizar_producto/:id", actualizar_producto)

export default router