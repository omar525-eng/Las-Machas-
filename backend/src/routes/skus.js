import express from "express"
import { createSKU, updateSKU, updateEstadoSKU } from "../controllers/skus.js"

const router = express.Router()

router.post("/", createSKU)   // POST /api/skus
router.put("/:id", updateSKU)  // PUT  /api/skus/:id
router.patch("/:id/estado", updateEstadoSKU) // PATCH /api/skus/:id/estado

export default router