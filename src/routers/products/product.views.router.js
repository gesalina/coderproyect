import { Router } from "express";
import { productsController, realTimeProductsController } from "../../controllers/viewer.controller.js";
import { handlePolicies } from "../../utils.js";

const router = Router();

/**
 * This router render the products view with the user information
 */
router.get("/", productsController);

/**
 * This router allows to render the products on realtime
 * have a form and a delete button working with websocket
 */
router.get(
    "/realtimeproducts",
    handlePolicies(['admin']),
    realTimeProductsController
  );

  export default router;
