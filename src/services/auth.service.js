import UserModel from "../dao/models/user.model.js";
import TokenModel from "../dao/models/token.model.js";
import {
  createHash,
  isValidPassword,
  generateToken,
  sendEmail,
} from "../helpers/auth.helper.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export default class Auth {
  constructor() {
    this.error = "";
  }

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
      await UserModel.findOneAndUpdate(
        { email: username },
        { $set: { last_connection: Date.now() } },
        { new: true }
      );
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
        const token = generateToken(userExists);
        userExists.token = token;
        return done(null, userExists);
      }
      const newUser = {
        first_name: username,
        last_name: "",
        email: userEmail,
        age: "",
        password: "",
      };

      const result = await UserModel.create(newUser, { new: true });

      const token = generateToken(result);
      result.token = token;

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
      const existingUser = await UserModel.findById(user._id).lean();

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
  /**
   * This function send a reset token
   */
  requestPasswordReset = async (email) => {
    try {
      const user = await UserModel.findOne({ email: email }).lean();
      if (!user) {
        return (this.error = { error: "This email is not valid" });
      }
      let token = await TokenModel.findOne({ userId: user._id });
      if (token) {
        await token.deleteOne();
      }
      let resetToken = crypto.randomBytes(32).toString("hex");
      const hash = createHash(resetToken);

      await TokenModel.create({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
      });

      const link = `https://coderproyect-production.up.railway.app/session/passwordReset?token=${resetToken}&id=${user._id}`;
      const message = `
      <div>
      <h2>Hi ${user.first_name}</h2>
      <p>You has been request a password reset, please follow this link to reset your passowrd</p>
      <a href="${link}">Reset password</a>
      </div>
      `;
      sendEmail(user.email, "Password Reset Request", message);
      return link;
    } catch (error) {
      return error;
    }
  };

  resetPassword = async (request) => {
    let user = request.body;
    const { userId, token, password } = user;
    let passwordResetToken = await TokenModel.findOne({ userId: userId });
    if (!passwordResetToken) {
      return (this.error = { error: "The token is invalid or expired" });
    }

    const isTokenValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isTokenValid)
      return (this.error = { error: "The token is invalid or expired" });

    const hash = createHash(password);

    await UserModel.updateOne(
      {
        _id: userId,
      },
      { $set: { password: hash } },
      { new: true }
    );

    const userEmail = await UserModel.findById({ _id: userId });

    sendEmail(
      userEmail.email,
      "Your password has been changed successfully",
      `<div>Hi ${userEmail.first_name} your password has been changed</div>`
    );

    await passwordResetToken.deleteOne();

    return { message: "The password has been change successfully" };
  };

  /**
   * This change password method is only available
   * if the user has a active session
   */
  changePassword = async (request) => {
    let user = request.body;
    const oldpassword = user.oldpassword;
    const newpassword = user.newpassword;
    try {
      /**
       * Find the user with the request _id
       */
      const searchUser = await UserModel.findOne({
        _id: request.user.user._id || user.id,
      });
      /**
       * Validate if actual password are equals
       */
      const validatePassword = bcrypt.compareSync(
        oldpassword,
        searchUser.password
      );
      if (!validatePassword)
        return (this.error = { error: "The password is incorrect" });

      /**
       * Validate if the new password and the actual password
       * are different
       */
      const validateDifferentPassword = bcrypt.compareSync(
        newpassword,
        searchUser.password
      );

      if (validateDifferentPassword)
        return (this.error = {
          error: "The new password must be different to the actual password",
        });
      const hashNewPassword = createHash(newpassword);
      const result = await UserModel.findOneAndUpdate(
        { _id: searchUser._id },
        { $set: { password: hashNewPassword } },
        { new: true }
      );
      sendEmail(searchUser.email, "Password has been reset successfully");
      return result;
    } catch (error) {
      return error;
    }
  };

  userAccessLevel = async (request) => {
    try {
      let user = request.body;
      const premiumDocuments = [
        "Identificacion",
        "Comprobante de domicilio",
        "Comprobante de estado de cuenta",
      ];
      const { email, accessLevel } = user;
      const findUser = await UserModel.findOne({ email: email });
      if (!findUser)
        return (this.error = { error: "The user doest not exist" });
      const findDocs = findUser.documents.map(function (document) {
        if (premiumDocuments.includes(document.name)) return true;
      });
      if (!findDocs && accessLevel["PREMIUM"])
        return (this.error = {
          error:
            "Is needed all the documents before to change the user role to premium",
        });
      if (findUser.role === accessLevel)
        return (this.error = { error: "This user has that access level" });
      const result = await UserModel.findOneAndUpdate(
        {
          _id: findUser._id,
        },
        { $set: { role: accessLevel } },
        { new: true }
      );
      console.log(result);
      return result;
    } catch (error) {
      return error;
    }
  };

  logoutHandler = async (request) => {
    try {
      const user = await UserModel.findOneAndUpdate(
        { email: request.user.email },
        { $set: { last_connection: Date.now() } },
        { new: true }
      );
      if (!user) return (this.error = { error: "User not found" });
    } catch (error) {
      return error;
    }
  };

  userFileUpload = async (request) => {
    try {
      const user = await UserModel.findById({ _id: request.params.uid });
      if (!user) return (this.error = { error: "User not found" });
      request.files.forEach(async (file) => {
        const updateDocuments = await UserModel.findOneAndUpdate(
          { _id: user._id },
          {
            $push: {
              documents: {
                name: file.filename,
                reference: `https://coderproyect-production.up.railway.app/public/img/${request.body.customPath}`,
              },
            },
          }
        );
      });
    } catch (error) {
      return error;
    }
  };

  getAllUsers = async (request) => {
    try {
      const users = await UserModel.find({})
        .select("-_id first_name email role")
        .lean()
        .exec();
      return users;
    } catch (error) {
      return error;
    }
  };

  deleteUser = async (request) => {
    try {
      let { email } = request.body;
      const deleteUser = await UserModel.findOneAndDelete({ email: email });
      return deleteUser;
    } catch (error) {
      return error;
    }
  };

  deleteUsers = async (request) => {
    try {
      const last_connection = new Date();
      last_connection.setDate(last_connection.getDate() - 2);
      const inactiveUsers = await UserModel.find({
        last_connection: { $lt: last_connection },
      });
      // If the last_connection of the users is less than 2 days return false
      inactiveUsers.find((user) => {
        sendEmail(
          user.email,
          "Your account has been deleted",
          "<div>You account has been deleted because the last connection is greater than 2 days</div>"
        );
        // HERE ADD DELETE METHOD
      });
    } catch (error) {
      return error;
    }
  };
}
