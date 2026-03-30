import express from "express"
import { obtenerPedidos, crearPedido, getDetallePedido } from "../controllers/pedido.js"

const router = express.Router()

router.get("/", obtenerPedidos)
router.post("/", crearPedido)
router.get("/:id", getDetallePedido)

export default router