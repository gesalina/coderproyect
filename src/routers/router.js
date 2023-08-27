import { Router } from "express";
import jwt from "jsonwebtoken";
import Auth from "../services/auth.service.js";

export default class routerHandler {
  constructor() {
    this.router = Router();
    this.auth = new Auth();
    this.init();
  }
  /**
   *  Initializate the inherited classes
   */
  init() {}

  getRouter() {
    return this.router;
  }
  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.handlePolicies(policies),
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
    next();
  };
  /**
   *  Handle the policies,
   *  validate the users rights
   */
  handlePolicies = (policies) => (request, response, next) => {
    const authHeaders = request.signedCookies[JWT_COOKIE_NAME];
    if (policies[0] === "PUBLIC") return next();
    if (!authHeaders)
      return response
        .status(401)
        .send({ status: "error", error: "Unauthorized" });
    const token = this.auth.extractCookie(request);
    let user = jwt.verify(token, JWT_PRIVATE_KEY);
    if (!policies.includes(user.role.toUpperCase()))
      return response
        .status(403)
        .send({ error: "error", error: "Not privileges" });
    request.user = user;
    next();
  };
}
