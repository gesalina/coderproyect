import passport from "passport";
import passport_jwt from "passport-jwt";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import dotenv from "dotenv";
import { extractCookie } from "../helpers/auth.helper.js";
import { authRepository } from "../repositories/repository.js";
dotenv.config();

const JWTStrategy = passport_jwt.Strategy;
const ExtractJWT = passport_jwt.ExtractJwt;

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  /**
   * Use passport to register a new user
   */
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (request, username, password, done) => {
        try {
          let data = request.body;
          return authRepository.createUser(data, username, password, done);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

/**
 * User passport to authenticate the user
 */
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (username, password, done) => {
      try {
        return authRepository.loginUser(username, password, done);
      } catch (error) {
        return done(error);
      }
    }
  )
);
/**
 * User github passport to auth user
 */
passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: process.env.clientId,
      clientSecret: process.env.clientSecret,
      callbackUrl: process.env.callbackUrl,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        return authRepository.gitHubLogin(
          accessToken,
          refreshToken,
          profile,
          done
        );
      } catch (error) {
        return done(error);
      }
    }
  )
);
/**
 * JWT strategy
 */
passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
      secretOrKey: process.env.JWT_PRIVATE_KEY,
    },
    async (jwt_payload, done) => {
      try {
        return authRepository.jwtAuth(jwt_payload, done);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "current",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
      secretOrKey: process.env.JWT_PRIVATE_KEY,
    },
    async (jwt_payload, done) => {
      try {
        return authRepository.getUser(jwt_payload, done);
      } catch (error) {
        return done(error);
      }
    }
  )
);
/**
 * Save the user id into the session file store
 */
passport.serializeUser((user, done) => {
  done(null, user._id);
});

/**
 * Match our session ID with our session file store
 * and return our user id
 */
passport.deserializeUser(async (id, done) => {
  const user = await authRepository.findUserById(id);
  done(null, user);
});

export default initializePassport;
