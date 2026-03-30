import express from "express"
import { createSKU, updateSKU } from "../controllers/skus.js"

const router = express.Router()

router.post("/",    createSKU)   // POST /api/skus
router.put("/:id",  updateSKU)  // PUT  /api/skus/:id

export default router