/**
*  Services
*/
import Auth from "../services/auth.service.js";
import Product from "../services/products.service.js";
import Cart from "../services/cart.service.js";
import Chat from "../services/chat.service.js";

/**
*  Repositories
*/
import AuthRepository from "./auth.repository.js";
import ProductRepository from "./product.repository.js";
import CartRepository from "./cart.repository.js";
import ChatRepository from './chat.repository.js';



export const authRepository = new AuthRepository(new Auth());
export const productRepository = new ProductRepository(new Product());
export const cartService = new CartRepository(new Cart());
export const chatService = new ChatRepository(new Chat());
