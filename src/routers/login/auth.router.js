import { passportCall } from "../../utils.js";
import routerHandler from "../router.js";
import passport from "passport";
import {
  failLoginController,
  failRegisterController,
  gitHubController,
  loginController,
  loginFormController,
  logoutController,
  registerController,
  registerFormController,
  userDataController,
} from "../../controllers/session.controller.js";

export default class AuthRouter extends routerHandler {
  init() {
    /**
     * This route get the login form
     */
    this.get("/login", ["PUBLIC"], loginFormController);

    /**
     * API for register a new user
     */
    this.post(
      "/register",
      ["PUBLIC"],
      passport.authenticate("register", {
        failureRedirect: "/session/failRegister",
      }),
      registerController
    );

    /**
     * Failed route
     */
    this.get("/failRegister", ["PUBLIC"], failRegisterController);

    /**
     * This route get the register form
     */

    this.get("/register", ["PUBLIC"], registerFormController);
    /**
     * API for login, this auth the user
     */
    this.post(
      "/login",
      ["PUBLIC"],
      passport.authenticate("login", {
        failureRedirect: "/session/failLogin",
      }),
      loginController
    );

    /**
     * Login failed route
     */
    this.get("/failLogin", ["PUBLIC"], failLoginController);

    /**
     * API to destroy the sessions
     */
    this.post("/logout", ["PUBLIC"], logoutController);

    /**
     * API to login with github, redirect to the passport github middleware to get
     * the users rights and data
     */
    this.get(
      "/github",
      ["PUBLIC"],
      passport.authenticate("github", { scope: ["user:email"] }),
      async (request, response) => {}
    );

    /**
     * API to complete the login, after the auth the user in the github passport middleware
     * this redirect you to the view
     */
    this.get(
      "/githubcallback",
      ["PUBLIC"],
      passport.authenticate("github", { failureRedirect: "/session/login" }),
      gitHubController
    );

    this.get("/current", ["USER"], passportCall("current"), userDataController);
  }
}
