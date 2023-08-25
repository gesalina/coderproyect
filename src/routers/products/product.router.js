import { Router } from "express";
import { getProductsController, getProductsByIdController, createProductController, deleteProductController, updateProductController } from "../../controllers/product.controller.js";
const router = Router();

/**
 * This endpoint return all the products with pagination available
 */
router.get("/", getProductsController);

/**
 * This endpoint filter a product by ID
 */
router.get("/:pid", getProductsByIdController);
/**
 * This endpoint create a new product
 */
router.post("/", createProductController);
/**
 * This endpoint delete a product by ID
 */
router.delete("/:pid", deleteProductController);
/**
 * This endpoint update a product
 */
router.put("/:pid", updateProductController);

export default router;
