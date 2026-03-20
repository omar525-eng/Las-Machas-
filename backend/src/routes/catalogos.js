import express from "express"
import { getCatalogo } from "../controllers/catalogo.js"

const router = express.Router()

router.get("/", getCatalogo)

export default router