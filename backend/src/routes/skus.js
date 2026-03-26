import express from "express"
import { updateSKU } from "../controllers/skus.js"

const router = express.Router()

router.put("/:id", updateSKU)

export default router