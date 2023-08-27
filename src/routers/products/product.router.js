import routerHandler from "../router.js";
import {
  getProductsController,
  getProductsByIdController,
  createProductController,
  deleteProductController,
  updateProductController,
} from "../../controllers/product.controller.js";

export default class ProductRouter extends routerHandler {
  init() {
    /**
     * This endpoint return all the products with pagination available
     */
    this.get("/", ["PUBLIC"], getProductsController);

    /**
     * This endpoint filter a product by ID
     */
    this.get("/:pid", ["PUBLIC"], getProductsByIdController);
    /**
     * This endpoint create a new product
     */
    this.post("/", ["ADMIN"], createProductController);
    /**
     * This endpoint delete a product by ID
     */
    this.delete("/:pid", ["ADMIN"], deleteProductController);
    /**
     * This endpoint update a product
     */
    this.put("/:pid", ["ADMIN"], updateProductController);
  }
}
