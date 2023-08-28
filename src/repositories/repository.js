import Auth from "../services/auth.service.js";

/**
*  Repositories
*/
import AuthRepository from "./auth.repository.js";
import ProductRepository from "./product.repository.js";
import CartRepository from "./cart.repository.js";
import ChatRepository from './chat.repository.js';



export const authService = new AuthRepository(new Auth());
