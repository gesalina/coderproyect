import { Router } from "express";
import jwt from "jsonwebtoken";
import { extractCookie } from "../helpers/auth.helper.js";
import passport from "passport";

export default class routerHandler {
  constructor() {
    this.router = Router();
    this.extractCookie = extractCookie;
    this.init();
  }
  /**
   *  Initializate the inherited classes
   */
  init() {}

  getRouter() {
    return this.router;
  }
  get(path, routerSecurity, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(routerSecurity),
      this.authenticateSession(routerSecurity),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  post(path, routerSecurity, ...callbacks) {
    this.router.post(
      path,
      this.handlePolicies(routerSecurity),
      this.authenticateSession(routerSecurity),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  put(path, routerSecurity, ...callbacks) {
    this.router.put(
      path,
      this.handlePolicies(routerSecurity),
      this.authenticateSession(routerSecurity),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, routerSecurity, ...callbacks) {
    this.router.delete(
      path,
      this.handlePolicies(routerSecurity),
      this.authenticateSession(routerSecurity),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }
  /**
   *  Map the callbacks to handle the intern functions
   */
  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        console.log(error);
        params[1].status(500).json({ error: error });
      }
    });
  }
  /**
   *  Generate custom response to the object response
   */
  generateCustomResponses = (request, response, next) => {
    response.sendSuccess = (payload) =>
      response.send({ status: "success", payload });
    response.sendServerError = (error) =>
      response.status(500).send({ status: "error", error });
    response.sendUserError = (error) =>
      response.status(400).send({ status: "error", error });
    response.sendRequestError = (error) =>
      response.status(404).send({ status: "error", error });
    next();
  };
  /**
   *  Handle the policies to access to the router
   *  validate the users rights, this function get 1 parameter.
   *  accessLevel: PUBLIC, USER, ADMIN
   */
  handlePolicies = (policies) => (request, response, next) => {
    const authHeaders = request.cookies[process.env.JWT_COOKIE_NAME];
    if (policies.accessLevel === "PUBLIC") return next();
    if (!authHeaders)
      return response
        .status(401)
        .send({ status: "error", error: "Unauthorized" });
    const token = this.extractCookie(request);
    let user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    if (!policies.accessLevel.includes(user.user.role.toUpperCase()))
      return response
        .status(403)
        .send({ error: "error", error: "Not privileges" });
    request.user = user;
    next();
  };
  /**
   * Validate if the user need to be logged to access to the route.
   * This function get 2 params to validate.
   *
   * needAuth: if is true, the route need a session
   * strategy: get the authentication stratagy (jwt or current)
   */
  authenticateSession = (routerSecurity) => async (request, response, next) => {
    if (!routerSecurity.needAuth) return next();
    passport.authenticate(
      routerSecurity.strategy,
      function (error, user, info) {
        if (error) return next(error);
        if (!user)
          return response.status(401).render("errors/base", {
            error: info.messages ? info.messages : info.toString(),
          });
        request.user = user;
        next();
      }
    )(request, response, next);
  };
}
