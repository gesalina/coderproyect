import routerHandler from "../router.js";
import {
  createCartController,
  deleteProductController,
  emptyCartProductController,
  findCartByIdController,
  getCartProductsController,
  getCartsController,
  updateCartController,
  updateProductController,
  finishPurchaseController
} from "../../controllers/carts.controller.js";

export default class CartRouter extends routerHandler {
  init() {
    /**
     * This endpoint get all carts
     */
    this.get(
      "/",
      { accessLevel: "PUBLIC", needAuth: false },
      getCartsController
    );
    /**
     * This endpoint get the products of a cart
     */
    this.get(
      "/:cid/products",
      { accessLevel: ["PUBLIC"], needAuth: true, strategy: "jwt" },
      getCartProductsController
    );
    /**
     * This endpoint find a cart by ID
     */
    this.get(
      "/:cid",
      { accessLevel: "PUBLIC", needAuth: true, strategy: "jwt" },
      findCartByIdController
    );
    /**
     * This endpoint create a new cart
     */
    this.post(
      "/",
      { accessLevel: "PUBLIC", needAuth: true, strategy: "jwt" },
      createCartController
    );

    /**
     *  This endpoint delete a product from a cart | EXPERIMENTAL
     *
     */
    this.delete(
      "/:cid/products/:pid",
      { accessLevel: "PUBLIC", needAuth: true, strategy: "jwt" },
      deleteProductController
    );
    /**
     * This ENDPOINT update the cart with a array of products
     */
    this.put(
      "/:cid",
      { accessLevel: "PUBLIC", needAuth: false},
      updateCartController
    );
    /**
     *  This endpoint update the quantity of a product in a specific cart
     */
    this.put(
      "/:cid/products/:pid",
      { accessLevel: "PUBLIC", needAuth: true, strategy: "jwt" },
      updateProductController
    );

    /**
     * This ENDPOINT delete all products from a specific cart
     */
    this.delete(
      "/:cid",
      { accessLevel: "PUBLIC", needAuth: true, strategy: "jwt" },
      emptyCartProductController
    );

    /**
     * Ticket Router
     */
    this.get("/:cid/purchase", { accessLevel: "PUBLIC", needAuth: false }, finishPurchaseController );
  }
}
