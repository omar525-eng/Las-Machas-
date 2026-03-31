import express from "express"
import { getInventarioInactivo } from "../controllers/inventario.js"

const router = express.Router()

router.get("/inactivos", getInventarioInactivo)

export default router