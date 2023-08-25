
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
  response.send({ error: "Failed" });
};

export const failLoginController = async (request, response) => {
  response.send({ error: "Failed to authenticate" });
};

export const loginController = async (request, response) => {
  if (!request.user) {
    return response
      .status(400)
      .send({ status: "error", error: "Invalid credentials" });
  }
  response.cookie(process.env.JWT_COOKIE_NAME, request.user.token).redirect("/products");
};

export const logoutController = async (request, response) => {
  request.session.destroy((err) => {
    if (err)
      return response.json({ status: "error", message: "Ocurrio un error" });
    return response.clearCookie(process.env.JWT_COOKIE_NAME).redirect("/session/login");
  });
};

export const gitHubController = async (request, response) => {
  response.redirect("/products");
};

export const userDataController = async (request, response) => {
  if (!request.user) {
    return response
      .status(401)
      .json({ status: "error", error: "Dont exist a active session" });
  }
  response.status(200).json({ status: "success", payload: request.user });
};
