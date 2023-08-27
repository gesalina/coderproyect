import routerHandler from "../router.js";
import {
  getMessagesController,
  insertChatDataController,
} from "../../controllers/chat.controller.js";

export default class ChatRouter extends routerHandler {
  init() {
    /**
     * This endpoint show data about the chat
     * return user and message
     */
    this.get("/", ["USER", "ADMIN"],getMessagesController);
    /**
     * This endpoint insert data (user, message) on our messages collection
     * and emit a websocket to get on realtime the message write for the
     * users
     */
    this.post("/",["USER","ADMIN"], insertChatDataController);
  }
}
