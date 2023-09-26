import AuthValidator from "../dao/dto/auth.dto.js";
export default class AuthRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createUser = async (request, username, password, done) => {
    const validate = new AuthValidator(request);
    const result = await this.dao.createUser(
      validate,
      username,
      password,
      done
    );
    return result;
  };

  loginUser = async (username, password, done) => {
    const result = await this.dao.loginUser(username, password, done);
    return result;
  };

  gitHubLogin = async (accessToken, refreshToken, profile, done) => {
    const result = await this.dao.gitHubLogin(
      accessToken,
      refreshToken,
      profile,
      done
    );
    return result;
  };

  jwtAuth = async (jwt_payload, done) => {
    const result = await this.dao.jwtAuth(jwt_payload, done);
    return;
  };

  getUser = async (jwt_payload, done) => {
    const result = await this.dao.getUser(jwt_payload, done);
    return result;
  };

  findUserById = async (id) => {
    const result = await this.dao.findUserById(id);
    return result;
  };

  changePassword = async(request) => {
    const result = await this.dao.changePassword(request);
    return result
  }
  
  requestPasswordReset = async(request) => {
    const result = await this.dao.requestPasswordReset(request);
    return result;
  }
  resetPassword = async(request) => {
    const result = await this.dao.resetPassword(request);
    return result;
  }
  userAccessLevel = async(request) => {
    const result = await this.dao.userAccessLevel(request);
    return result;
  }
}
