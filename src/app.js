import express from "express";
import session from "express-session";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
import passport from "passport";
import cookieParser from "cookie-parser";
import initializePassport from "../src/middlewares/auth.middleware.js";
import run from "./run.js";

/**
 * API DOCUMENTATION DEPENDENCIES
 */
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

/**
 * ENVIROMENT CONFIGURATION
 */
dotenv.config();

const app = express();

/**
 * Set the templates engine
 */
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/routers/views");
app.set("view engine", "handlebars");

/**
 * User mongo sessions
 */
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.USER}:${process.env.KEY}@${process.env.MONGO_DATABASE_URL}`,
      dbName: "sessions",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: "gsal",
    resave: true,
    saveUninitialized: true,
  })
);

/**
 * Initialize passport
 */

initializePassport();

app.use(passport.initialize());
app.use(passport.session());
/**
 * Cookie parser
 */
app.use(cookieParser());

/**
 * Middleware for parse to JSON
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Set the static folder
 */
app.use("/content", express.static("./public"));

// app.use(errorHandlerMiddleware)
/**
 * API DOCUMENTATION
 */

const swaggerOptions = {
  definition:{
    openapi:'3.0.1',
    info:{
      title: "Documentation about tenda API",
      description:'This API is for coderhouse backend course'
    },
  },
  apis: [`./docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

/**
 * Establish database connection
 */

try {
  await mongoose.connect(
    `mongodb+srv://${process.env.USER}:${process.env.KEY}@${process.env.MONGO_DATABASE_URL}`
  );
  const serverHttp = app.listen(process.env.PORT, () =>
    console.log(`Server is running at: http://localhost:8080`)
  );
  
  const io = new Server(serverHttp);
  app.set("socketio", io);
  run(io, app);
} catch (err) {
  console.log(err);
}
