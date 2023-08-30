import TicketValidator from "../dao/dto/ticket.dto.js";

export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  finishTicket = async(request, cartId) => {
    const result = await this.dao.finishTicket(request, cartId);
    return result;
  }
}
