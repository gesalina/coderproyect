import { Router } from "express";
import {
  createCartController,
  deleteProductController,
  emptyCartProductController,
  findCartByIdController,
  getCartProductsController,
  getCartsController,
  updateCartController,
  updateProductController,
} from "../../controllers/carts.controller.js";
const router = Router();

/**
 * This endpoint get all carts
 */
router.get("/", getCartsController);
/**
 * This endpoint get the products of a cart
 */
router.get("/:cid/products", getCartProductsController);
/**
 * This endpoint find a cart by ID
 */
router.get("/:cid", findCartByIdController);
/**
 * This endpoint create a new cart
 */
router.post("/", createCartController);
/**
 * This endpoint add or update the product the a specific cart | OLDTEST ROUTE
 */
// router.post("/:cid/products/:pid", async (request, response) => {
//   let cartId = request.params.cid;
//   let productId = request.params.pid;
//   const { quantity } = request.body;
//   try {
//     const cartUpdate = await cart.updateCart(cartId, productId, quantity);
//     if (cartUpdate.error) {
//       return response
//         .status(404)
//         .json({ status: "error", error: cartUpdate.error });
//     }
//     response.json({ status: "Success" });
//   } catch (error) {
//     return response.status(404).json({ status: "error", error: error });
//   }
// });
/**
 *  This endpoint delete a product from a cart | EXPERIMENTAL
 *
 */
router.delete("/:cid/products/:pid", deleteProductController);
/**
 * This ENDPOINT update the cart with a array of products
 */
router.put("/:cid", updateCartController);
/**
 *  This endpoint update the quantity of a product in a specific cart
 */
router.put("/:cid/products/:pid", updateProductController);

/**
 * This ENDPOINT delete all products from a specific cart
 */
router.delete("/:cid", emptyCartProductController);
export default router;
