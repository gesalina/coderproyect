import UserModel from "../dao/models/user.model.js";

export default class Auth {
  constructor() {}

  createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  };

  isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
  };

  generateToken = (user) => {
    const token = jwt.sign({ user }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "24h",
    });
    return token;
  };
  extractCookie = (request) => {
    return request && request.cookies
      ? request.cookies[process.env.JWT_COOKIE_NAME]
      : null;
  };

  createUser = async (request, username, password, done) => {
    const { first_name, last_name, email, age } = request.body;
    try {
      const user = await UserModel.findOne({ email: username });

      if (user) {
        console.log("User already exists");
        return done(null, false);
      }

      const newUser = {
        first_name,
        last_name,
        email,
        age: parseInt(age),
        password: createHash(password)
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
        password: ""
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
}
