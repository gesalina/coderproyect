import { Router } from "express";
import {
  chatController,
  redirectLoginController,
} from "../../controllers/viewer.controller.js";

const router = Router();

/*
 * This router allows to show the products in the main view
 */

router.get("/", redirectLoginController);

/**
 *  This router render the chat, that work with websocket
 */
router.get("/chat", chatController);


export default router;
