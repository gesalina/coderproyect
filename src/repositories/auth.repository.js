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
}
