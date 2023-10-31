import routerHandler from "../router.js";
import {
  paymentController,
  paymentSuccessController,
  paymentCancelController,
} from "../../controllers/payment.controller.js";

export default class PaymentRouter extends routerHandler {
  init() {
    /*
     * This router allows to show the products in the main view
     */

    this.get(
      "/createCheckout/:cid",
      {
        accessLevel: ["USER", "PREMIUM", "ADMIN"],
        needAuth: true,
        strategy: "jwt",
      },
      paymentController
    );

    /**
     *  This router render the chat, that work with websocket
     */
    this.get(
      "/success/:cid",
      {
        accessLevel: ["USER", "PREMIUM", "ADMIN"],
        needAuth: true,
        strategy: "jwt",
      },
      paymentSuccessController
    );

    /**
     *  This router render the chat, that work with websocket
     */
    this.get(
      "/cancel",
      {
        accessLevel: ["USER", "PREMIUM", "ADMIN"],
        needAuth: true,
        strategy: "jwt",
      },
      paymentCancelController
    );
  }
}
