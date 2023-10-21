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
  userChangePassword,
  userChangePasswordForm,
  resetPassword,
  recoverPasswordForm,
  passwordResetForm,
  requestPasswordReset,
  adminPanelView,
  userAccessLevel
} from "../../controllers/session.controller.js";
export default class AuthRouter extends routerHandler {
  init() {
    /**
     * This route get the login form
     */
    this.get(
      "/login",
      { accessLevel: "PUBLIC", needAuth: false },
      loginFormController
    );

    /**
     * API for register a new user
     */
    this.post(
      "/register",
      { accessLevel: "PUBLIC", needAuth: false },
      passport.authenticate("register", {
        failureRedirect: "/session/failRegister",
      }),
      registerController
    );

    /**
     * Failed route
     */
    this.get(
      "/failRegister",
      { accessLevel: "PUBLIC", needAuth: false },
      failRegisterController
    );

    /**
     * This route get the register form
     */

    this.get(
      "/register",
      { accessLevel: "PUBLIC", needAuth: false },
      registerFormController
    );
    /**
     * API for login, this auth the user
     */
    this.post(
      "/login",
      { accessLevel: "PUBLIC", needAuth: false },
      passport.authenticate("login", {
        failureRedirect: "/session/failLogin",
      }),
      loginController
    );

    /**
     * Login failed route
     */
    this.get(
      "/failLogin",
      { accessLevel: "PUBLIC", needAuth: false },
      failLoginController
    );

    /**
     * API to destroy the sessions
     */
    this.post(
      "/logout",
      { accessLevel: "PUBLIC", needAuth: false },
      logoutController
    );

    /**
     * API to login with github, redirect to the passport github middleware to get
     * the users rights and data
     */
    this.get(
      "/github",
      { accessLevel: "PUBLIC", needAuth: false },
      passport.authenticate("github", { scope: ["user:email"] }),
      async (request, response) => {}
    );

    /**
     * API to complete the login, after the auth the user in the github passport middleware
     * this redirect you to the view
     */
    this.get(
      "/githubcallback",
      { accessLevel: "PUBLIC", needAuth: false },
      passport.authenticate("github", { failureRedirect: "/session/login" }),
      gitHubController
    );
    /**
     * This route get the user data, but only with admin rights
     */
    this.get(
      "/profile",
      { accessLevel: ["USER","ADMIN"], needAuth: true, strategy: "current" },
      userDataController
    );
    
    /**
     * This route get the password change form
     */
    this.get(
      "/profile/changePassword",
      {accessLevel: ["USER","ADMIN"], needAuth: true, strategy: "jwt"},
      userChangePasswordForm
    )
    /**
     * This route change the password
     */
    this.post(
      "/profile/changePassword",
      {accessLevel: ["USER","ADMIN"], needAuth: true, strategy: "jwt"},
      userChangePassword
    )
    /**
     * This route get the recover password form
     */
    this.get(
      "/recoverPassword/",
      {accessLevel: "PUBLIC", needAuth: false},
      recoverPasswordForm
    )
    /**
     * This route get the request to send a email
     * with the token for the password reset
     */
    this.post(
      "/recoverPassword/",
      {accessLevel: "PUBLIC", needAuth: false},
      requestPasswordReset
    )
    /**
     * This route show the new password form
     */
    this.get(
      "/passwordReset/",
      {accessLevel: "PUBLIC", needAuth: false},
      passwordResetForm
    )
    /**
     * This route reset the password
     */
    this.post(
      "/passwordReset/",
      {accessLevel: "PUBLIC", needAuth: false},
      resetPassword
    )

    /**
     * This route get the form to change the accesslevel
     */
    this.get(
      "/adminpanel/users",
      {accessLevel: "ADMIN" , needAuth: true, strategy: "jwt"},
      adminPanelView
    )

    /**
     * This route change the user access level
     */
    this.post(
      "/adminpanel/users",
      {accessLevel: "ADMIN" , needAuth: true, strategy: "jwt"},
      userAccessLevel
    )
     /**
     * This route change the user access level
    this.post(
      "/users/:uid/documents",
      {accessLevel: "PUBLIC" , needAuth: true, strategy: "jwt"},
      userDocuments
    )
    */
  }
}
