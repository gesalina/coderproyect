import Auth from "../services/auth.service.js";
import AuthRepository from "./auth.repository.js";

export const authService = new AuthRepository(new Auth());
