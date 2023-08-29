import CartValidator from "../dao/dto/cart.dto.js";

export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getCarts = async() => {
  const result = this.dao.getCarts();
    return result;
  }
  /**
  * The request is the cart ID
  */
  getCartById = async(request) => {
    const result = this.dao.getCartById(request);
    return result;
  }

  createCart = async(request) => {
    const validate = new CartValidator(request);
    const result = this.dao.createCart(validate);
    return result;
  }
  /**
  * The request is the cart ID
  */
  getCartProduct = async(request) => {
    const result = this.dao.getCartProduct(request);
    return result;
  }

  deleteProductFromCart = async(cart, product) => {
    const result = this.dao.deleteProductFromCart(cart, product);
    return result;
  }

  addProductCart = async(cart, product, quantity) => {
    const result = this.dao.addProductCart(cart, product, quantity);
    return result;
  }

  updateProductQuantity = async(cart, product, quantity) => {
    const result = this.dao.updateProductQuantity(cart, product, quantity);
    return result;
  }

  deleteAllProducts = async(cart) => {
    const result = this.dao.deleteAllProducts(cart);
    return result;
  }

}
