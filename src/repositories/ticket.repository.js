import TicketValidator from "../dao/dto/ticket.dto.js";

export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }
}
