export default class ChatRepository {
    constructor(dao) {
      this.dao = dao;
    }
  getMessages = async() => {
      const result = this.dao.getMessages();
      return result;
  }

insertMessage = async(request) => {
    const result = this.dao.insertMessage(request);
    return result;
}
  }
