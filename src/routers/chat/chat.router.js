import { Router } from "express";
import {
  getMessagesController,
  insertChatDataController,
} from "../../controllers/chat.controller.js";

const router = Router();
+(
  /**
   * This endpoint show data about the chat
   * return user and message
   */
  router.get("/", getMessagesController)
);
/**
 * This endpoint insert data (user, message) on our messages collection
 * and emit a websocket to get on realtime the message write for the
 * users
 */
router.post("/", insertChatDataController);
export default router;
