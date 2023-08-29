export const loginFormController = async (request, response) => {
  response.render("sessions/login", {
    view_name: "Login | Tenda",
  });
};

export const registerFormController = async (request, response) => {
  response.render("sessions/register", {
    view_name: "Register | Tenda",
  });
};

export const registerController = async (request, response) => {
  response.redirect("/session/login");
};

export const failRegisterController = async (request, response) => {
  return response.sendServerError({
    status: "error",
    message: "Register failed",
  });
};

export const failLoginController = async (request, response) => {
  return response.sendServerError({
    status: "error",
    message: "Failed to authenticate",
  });
};

export const loginController = async (request, response) => {
  if (!request.user) {
    return response.sendServerError({
      status: "error",
      message: "Invalid credentials",
    });
  }
  response
    .cookie(process.env.JWT_COOKIE_NAME, request.user.token)
    .redirect("/products");
};

export const logoutController = async (request, response) => {
  request.session.destroy((error) => {
    if (error) {
      return response.sendServerError({
        status: "error",
        message: "Ocurrio un error",
      });
    }
    return response
      .clearCookie(process.env.JWT_COOKIE_NAME)
      .redirect("/session/login");
  });
};

export const gitHubController = async (request, response) => {
  response.redirect("/products");
};

export const userDataController = async (request, response) => {
  if (!request.user) {
    return response.sendRequestError({
      status: "error",
      message: "Do not authenticate",
    });
  }
  return response.sendSuccess(request.payload);
};
