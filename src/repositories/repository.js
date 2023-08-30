/**
 *  Services
 */
import Auth from "../services/auth.service.js";
import Product from "../services/products.service.js";
import Cart from "../services/cart.service.js";
import Chat from "../services/chat.service.js";
import Ticket from "../services/ticket.service.js";

/**
 *  Repositories
 */
import AuthRepository from "./auth.repository.js";
import ProductRepository from "./product.repository.js";
import CartRepository from "./cart.repository.js";
import ChatRepository from "./chat.repository.js";
import TicketRepository from "./ticket.repository.js";

export const authRepository = new AuthRepository(new Auth());
export const productRepository = new ProductRepository(new Product());
export const cartRepository = new CartRepository(new Cart());
export const chatRepository = new ChatRepository(new Chat());
export const ticketRepository = new TicketRepository(new Ticket());
