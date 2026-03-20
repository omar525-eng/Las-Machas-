import express from "express"
import { obtenerPedidos, crearPedido } from "../controllers/pedido.js"

const router = express.Router()

router.get("/", obtenerPedidos)
router.post("/", crearPedido)

export default router