export default class AuthValidator {
  constructor(user) {
    (this.first_name = user.body.first_name),
      (this.last_name = user.body.last_name),
      (this.email = user.body.email),
      (this.age = user.body.age);
  }
}
