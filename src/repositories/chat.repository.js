import CartValidator from '../dao/dto/cart.dto.js';

export default class ChatRepository {
    constructor(dao) {
      this.dao = dao;
    }
  getMessages = async() => {
      const result = this.dao.getMessages();
      return result;
  }

insertMessage = async(request) => {
    const validate = new CartValidator(request);
    const result = this.dao.insertMessage(validate);
    return result;
}
  }
