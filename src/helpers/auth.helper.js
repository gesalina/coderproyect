import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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

export const sendEmail = async (email, subject, payload) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    const options = () => {
      return {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: subject,
        html: payload
      };
    };
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        return error;
      } else {
        return {
          success: true,
        };
      }
    });
  } catch (error) {
    return error;
  }
};
