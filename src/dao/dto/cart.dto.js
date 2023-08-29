export default class CartValidator {
  constructor(cart) {
    (this.userId = cart.userId),
    this.cartId = cart.cartId || null,
    this.quantity = cart.quantity || null
  }
}
