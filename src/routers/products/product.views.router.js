import routerHandler from "../router.js";
import {
  productsController,
  realTimeProductsController,
} from "../../controllers/viewer.controller.js";

export default class ProductViewerRouter extends routerHandler {
  init() {
    /**
     * This router render the products view with the user information
     */
    this.get("/", { accessLevel: "PUBLIC", needAuth: false}, productsController);

    /**
     * This router allows to render the products on realtime
     * have a form and a delete button working with websocket
     */
    this.get("/realtimeproducts", { accessLevel: "ADMIN", needAuth: true, strategy: "jwt" }, realTimeProductsController);
  }
}
