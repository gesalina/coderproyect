import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

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
