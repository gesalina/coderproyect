export default class AuthValidator {
  constructor(user) {
    (this.first_name = user.first_name),
      (this.last_name = user.last_name),
      (this.email = user.email),
      (this.age = parseInt(user.age));
  }
}
