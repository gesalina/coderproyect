import { chatRepository } from "../repositories/repository.js";

export const getMessagesController = async (request, response) => {
  try {
    const result = await chatRepository.getMessages();
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};
export const insertChatDataController = async (request, response) => {
  let data = request.body;
  try {
    const result = await chatRepository.insertMessage(data);
    request.app.get("socketio").emit("logs", result);
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};
