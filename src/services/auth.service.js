import UserModel from "../dao/models/user.model.js";
import TokenModel from "../dao/models/token.model.js";
import {
  createHash,
  isValidPassword,
  generateToken,
} from "../helpers/auth.helper.js";

export default class Auth {
  constructor() {}

  createUser = async (request, username, password, done) => {
    try {
      const user = await UserModel.findOne({ email: username });

      if (user) {
        console.log("User already exists");
        return done(null, false);
      }

      const newUser = {
        ...request,
        password: createHash(password),
      };
      console.log(newUser);
      if (
        newUser.email === process.env.CODER_EMAIL &&
        bcrypt.compareSync(process.env.CODER_PASSWORD, newUser.password)
      ) {
        newUser.role = "admin";
      }
      const result = await UserModel.create(newUser);
      console.log(result);
      return done(null, result);
    } catch (error) {
      return done(error);
    }
  };

  loginUser = async (username, password, done) => {
    try {
      const user = await UserModel.findOne({ email: username });
      if (!user) {
        return done(null, false);
      }
      if (!isValidPassword(user, password)) {
        return done(null, false);
      }
      const token = generateToken(user);
      user.token = token;
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  };

  gitHubLogin = async (accessToken, refreshToken, profile, done) => {
    try {
      const username = profile.displayName || profile.username;
      const userEmail = profile._json.email;
      const userExists = await UserModel.findOne({ email: userEmail });
      if (userExists) {
        return done(null, userExists);
      }
      const newUser = {
        first_name: username,
        last_name: "",
        email: userEmail,
        age: "",
        password: "",
      };

      const result = await UserModel.create(newUser);
      return done(null, result);
    } catch (error) {
      return done(error);
    }
  };

  jwtAuth = async (jwt_payload, done) => {
    done(null, jwt_payload);
  };

  getUser = async (jwt_payload, done) => {
    try {
      const user = jwt_payload.user;
      if (!user) {
        return done(null, false, { message: "Token do not provided" });
      }
      const existingUser = await UserModel.findById(user._id);

      if (!existingUser) {
        return done(null, false, { message: "There isnt a user active" });
      }
      return done(null, existingUser);
    } catch (error) {
      return done(error);
    }
  };

  findUserById = async (id) => {
    const result = await UserModel.findById(id);
    return result;
  };

  requestPasswordReset = async (email) => {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return null;
      }
      let token = await TokenModel.findOne({userId: user._id});
      if(token){
        await token.deleteOne();
      }
      let resetToken;
      const hash = createHash(resetToken);

      await TokenModel.create({
        userId: user._id,
        token: hash,
        createdAt: Date.now()
      })

      const link = `${url}/passwordReset?token=${resetToken}&id=${user._id}`;
      sendEmail(user.email, "Password Reset Request",{name: user.first_name, link: link}, "requestResetPassword.handlebars");
      return link;
    } catch (error) {
      console.log(error);
    }
  };

  resetPassword = async(userId, token, password) => {
    let passwordResetToken = await TokenModel.findOne({userId});
    if(!passwordResetToken){
      throw new Error("Invalid or expired password reset token");
    }
  }
}
