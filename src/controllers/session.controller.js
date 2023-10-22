import { authRepository } from "../repositories/repository.js";

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
  request.session.destroy(async (error) => {
    if (error) {
      return response.sendServerError({
        status: "error",
        message: "Ocurrio un error",
      });
    }
    await authRepository.logoutHandler(request);
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
  return response.render("sessions/profile", {
    view_name: "Profile",
    user: request.user,
    isAuth: true,
    isAdmin: request.user.role.toUpperCase() == "ADMIN" ? true : false,
  });
};

export const userChangePasswordForm = async (request, response) => {
  return response.render("sessions/changePassword", {
    view_name: "Settings | Change password",
    user: request.user.user,
    isAuth: true,
  });
};

export const userChangePassword = async (request, response) => {
  try {
    const result = await authRepository.changePassword(request);
    if (result.error) return response.sendUserError(result.error);
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};
/**
 * Get the password reset form
 */
export const recoverPasswordForm = async (request, response) => {
  response.render("sessions/recoverpassword", {
    view_name: "Recover password",
  });
};

/**
 * Get the POST request and send a email
 * with the token to reset password
 */
export const requestPasswordReset = async (request, response) => {
  let user = request.body;
  try {
    const result = await authRepository.requestPasswordReset(user.email);
    if (result.error) return response.sendUserError(result.error);
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};
/**
 * Show the new password form
 */
export const passwordResetForm = async (request, response) => {
  response.render("sessions/resetPassword", {
    view_name: "Reset your password",
  });
};
/**
 * Reset the password if the token is valid
 */
export const resetPassword = async (request, response) => {
  try {
    const result = await authRepository.resetPassword(request);
    if (result.error) return response.sendUserError(result.error);
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const adminPanelView = async (request, response) => {
  response.render("sessions/adminpanel/usersManager", {
    view_name: "Admin Panel | Manage Users",
    user: request.user.user,
    isAuth: true,
  });
};

export const userAccessLevel = async (request, response) => {
  try {
    const result = await authRepository.userAccessLevel(request);
    if (result.error) return response.sendUserError(result.error);
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const userFileUpload = async (request, response) => {
  try {
    const result = await authRepository.userFileUpload(request);
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};
