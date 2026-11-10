import { Router } from "express"
import ProductController from "../controllers/ProductController.js"

const router = new Router()

router.get("/products" , ProductController.getProducts )
router.get("/products/:id" , ProductController.getOneProduct ) // ← новый
router.post("/addproduct" , ProductController.addProduct)
router.put("/products/:id" , ProductController.updateProduct ) // ← новый
router.delete("/products/:id" , ProductController.deleteProduct ) // ← новый

export default router;