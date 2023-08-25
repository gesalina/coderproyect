import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

/**
 * Hash the password
 */
export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
/**
 * Validate the password
 */
export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const generateToken = (user) => {
  const token = jwt.sign({ user }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "24h",
  });
  return token;
};

export const extractCookie = (request) => {
  return request && request.cookies
    ? request.cookies[process.env.JWT_COOKIE_NAME]
    : null;
};

export const passportCall = (strategy) => {
  return async (request, response, next) => {
    passport.authenticate(strategy, function (error, user, info) {
      if (error) return next(error);
      if (!user)
        return response
          .status(401)
          .render("errors/base", {
            error: info.messages ? info.messages : info.toString(),
          });
      request.user = user;
      next();
    })(request, response, next);
  };
};

export const handlePolicies = (policies) => (req, res, next) => {
  const user = req.user.user || null;
  console.log("handlePolicies: ", user);
  if (policies.includes("ADMIN")) {
    if (user.role !== "admin") {
      return res.status(403).render("errors/base", {
        error: "Need to be an ADMIN",
      });
    }
  }
  return next();
};

// export const isUserAuth = async(request, response, next) => {
//   if(!request.user){
//     next();
//   }
//   response.redirect('back');
// }
