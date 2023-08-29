import routerHandler from "../router.js";
import {
  chatController,
  redirectLoginController,
} from "../../controllers/viewer.controller.js";

export default class ViewRouter extends routerHandler {
  init() {
    /*
     * This router allows to show the products in the main view
     */

    this.get(
      "/",
      { accessLevel: "PUBLIC", needAuth: false },
      redirectLoginController
    );

    /**
     *  This router render the chat, that work with websocket
     */
    this.get(
      "/chat",
      { accessLevel: "ADMIN", needAuth: true, strategy: "jwt" },
      chatController
    );
  }
}
