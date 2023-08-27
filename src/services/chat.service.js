import { chatModel } from "../dao/models/chat.model";

export default class Chat {
  constructor() {
    this.error = "";
  }
  /**
   * This function get the user and messages from our collection
   */
  getMessages = async () => {
    try {
      const messages = await chatModel.find().lean();
      return messages;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  /**
   * This function insert into our collection the user and message
   */
  insertMessage = async (data) => {
    try {
      const result = await chatModel.create(data);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
