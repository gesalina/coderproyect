import { Router } from "express";
import {passportCall } from "../../utils.js"
import passport from "passport";
import { failLoginController, failRegisterController, gitHubController, loginController, loginFormController, logoutController, registerController, registerFormController, userDataController } from "../../controllers/session.controller.js";

const router = Router();

/**
 * This route get the login form
 */
router.get("/login", loginFormController);

/**
 * API for register a new user
 */
router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/session/failRegister",
  }),
  registerController
);

/**
 * Failed route
 */
router.get("/failRegister", failRegisterController);

/**
 * This route get the register form
 */

router.get("/register", registerFormController);
/**
 * API for login, this auth the user
 */
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/session/failLogin",
  }), loginController
);

/**
 * Login failed route
 */
router.get("/failLogin", failLoginController);

/**
 * API to destroy the sessions
 */
router.post("/logout", logoutController);

/**
 * API to login with github, redirect to the passport github middleware to get 
 * the users rights and data
 */
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (request, response) => {}
);

/**
 * API to complete the login, after the auth the user in the github passport middleware
 * this redirect you to the view
 */
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/session/login" }),
  gitHubController
);


router.get('/current', passportCall("current"), userDataController)

export default router;
