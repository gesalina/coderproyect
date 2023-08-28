import Auth from "../services/auth.service.js";
import AuthRepository from "./auth.repository.js";
import ProductRepository from "./product.repository.js";
import CartRepository from "./cart.repository.js";



export const authService = new AuthRepository(new Auth());
