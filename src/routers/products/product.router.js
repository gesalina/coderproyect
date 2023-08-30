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
    this.get(
      "/",
      { accessLevel: "PUBLIC", needAuth: false },
      getProductsController
    );

    /**
     * This endpoint filter a product by ID
     */
    this.get(
      "/:pid",
      { accessLevel: "PUBLIC", needAuth: false },
      getProductsByIdController
    );
    /**
     * This endpoint create a new product
     */
    this.post(
      "/",
      // { accessLevel: "ADMIN", needAuth: true, strategy: "jwt" },
      { accessLevel: "PUBLIC", needAuth: false},
      createProductController
    );
    /**
     * This endpoint delete a product by ID
     */
    this.delete(
      "/:pid",
      { accessLevel: "ADMIN", needAuth: true, strategy: "jwt" },
      deleteProductController
    );
    /**
     * This endpoint update a product
     */
    this.put(
      "/:pid",
      { accessLevel: "ADMIN", needAuth: true, strategy: "jwt" },
      updateProductController
    );
  }
}
