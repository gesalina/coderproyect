import ProductRouter from "../src/routers/products/product.router.js";
import cartRouter from "../src/routers/carts/cart.router.js";
import viewRouter from "../src/routers/main/view.router.js";
import ChatRouter from "../src/routers/chat/chat.router.js";
import AuthRouter from "./routers/login/auth.router.js";
import productViewsRouter from '../src/routers/products/product.views.router.js'
import { passportCall } from "./utils.js";

/**
 * Run the socket and the app
 */
const run = (io, app) => {
  app.use((request, response, next) => {
    request.io = io;
    next();
  });

  /**
   * API ENDPOINTS
   */
  
  /**
   * Product router
   * This ENDPOINT is protected by roles
   */
  const productRouter = new ProductRouter();
  app.use("/api/products", productRouter.getRouter());

  /**
   * Cart router
   */
  app.use("/api/carts", cartRouter);

  /**
   * Chat router
   * This ENDPOINT is protected by roles
   */
  const chatRouter = new ChatRouter();
  app.use("/api/chat", chatRouter.getRouter());

  /**
   * Authentication router
   * Includes login and register form
   */
  const authRouter = new AuthRouter();
  app.use("/session", authRouter.getRouter());

  /**
   * Products view
   */
  app.use('/products', passportCall('jwt'), productViewsRouter)

  /**
   * Main view route
   */
  app.use("/", viewRouter);

  /**
   * Socket IO initilization
   */

  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("productList", (data) => {
      io.emit("updateProducts", data);
    });
    socket.on("messages", (data) => {
      io.emit("logs", data);
    });
  });
};

export default run;
