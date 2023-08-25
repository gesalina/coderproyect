import productRouter from "../src/routers/products/product.router.js";
import cartRouter from "../src/routers/carts/cart.router.js";
import viewRouter from "../src/routers/main/view.router.js";
import chatRouter from "../src/routers/chat/chat.router.js";
import sessionRouter from "../src/routers/login/session.router.js";
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
   * API routes
   */

  app.use("/api/products", productRouter);
  app.use("/api/carts", cartRouter);
  app.use("/api/chat", chatRouter);
  app.use("/session", sessionRouter);
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
