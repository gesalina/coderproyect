import TicketValidator from "../dao/dto/ticket.dto.js";

export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  finishPurchase = async (request, cartId) => {
    const result = await this.dao.finishPurchase(request, cartId);
    return result;
  };
}
