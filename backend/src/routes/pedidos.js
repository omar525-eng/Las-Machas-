import express from "express"
import { obtenerPedidos, crearPedido, getDetallePedido, updateEstatusPedido } from "../controllers/pedido.js"

const router = express.Router()

router.get("/", obtenerPedidos)
router.post("/", crearPedido)
router.get("/:id", getDetallePedido)
router.patch("/:id/estatus", updateEstatusPedido)

export default router