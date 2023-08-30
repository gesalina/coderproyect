import { ticketRepository } from "../repositories/repository.js";

export const finishTicketController = async (request, response) => {
    let cartId = request.params.cid;
    const result = await ticketRepository.finishTicket(request, cartId);
    return response.sendSuccess(result);
};
