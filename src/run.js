import ProductRouter from "../src/routers/products/product.router.js";
import CartRouter from "./routers/cart/cart.router.js";
import ChatRouter from "../src/routers/chat/chat.router.js";
import AuthRouter from "./routers/login/auth.router.js";
import ProductViewerRouter from "../src/routers/products/product.views.router.js";
import ViewRouter from "../src/routers/main/view.router.js";
import errorHandlerMiddleware from "../src/middlewares/errors/errorHandler.middleware.js";

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
  const cartRouter = new CartRouter();
  app.use("/api/carts", cartRouter.getRouter());

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
  const productViewerRouter = new ProductViewerRouter();
  app.use('/products', productViewerRouter.getRouter())

  /**
   * Main view route
   */
  const viewRouter = new ViewRouter()
  app.use("/", viewRouter.getRouter());

  //Error middleware
  app.use(errorHandlerMiddleware)
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
