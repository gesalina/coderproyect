import passport from "passport";



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
