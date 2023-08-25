import chatManager from "../../src/dao/fsManager/CartManager.js";

const chat = new chatManager();

export const getMessagesController = async (request, response) => {
  const getMessages = await chat.getMessages();
  response.json(getMessages);
};
export const insertChatDataController = async (request, response) => {
  let data = request.body;
  const createMessage = await chat.insertMessage(data);
  request.app.get("socketio").emit("logs", createMessage);
  response.json({ status: "success", messages: createMessage });
};
