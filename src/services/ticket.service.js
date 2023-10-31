import { ticketModel } from "../dao/models/ticket.model.js";
import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "../dao/models/product.model.js";
import randomstring from "randomstring";

export default class Ticket {
  constructor() {
    this.error = "";
  }

  getTicketById = async (id) => {
    const result = ticketModel.findById({ _id: id });
    return result;
  };

  calculateCartAmount = async (cart) => {
    let totalAmount = 0;
    try {
      for (const products of cart) {
        const product = await productModel.findById(products.product);
        if (!product)
          return (this.error = { error: "Does not exist a cart with that id" });
        totalAmount += product.price * products.quantity;
      }
    } catch (error) {
      console.log(error);
    }
    return totalAmount;
  };

  /**
   * Finish the purchase
   */

  finishPurchase = async (request, cartId) => {
    const cart = await cartModel.findOne({
      _id: cartId,
      userId: request.user._id.toHexString(),
    });
    
    if (!cart)
      return (this.error = { error: "You do not have a cart with this id" });

    let discardedProducts = [];
    let processedProducts = [];

    /**
     * Iterate in each product of our cart
     */
    for (const product of cart.products) {
      /**
       * Search the product with the _id obtained in the validateCart
       */
      let validateStock = await productModel.findOne({
        _id: product.product.toHexString(),
      });

      /**
       * saveIds: this var save each product id that do not have stock
       */

      /**
       * If the product stock is equal to 0 save the id into saveIds
       */
      if (validateStock.stock < product.quantity || validateStock.stock === 0) {
        discardedProducts.push(validateStock._id.toHexString());
      } else {
        await productModel.findByIdAndUpdate(
          { _id: product.product.toHexString() },
          { $inc: { stock: -product.quantity } }
        );
        processedProducts.push(product);
      }
    }
    if (processedProducts.length >= 0) {
      const newTicket = {
        code: randomstring.generate(12),
        amount: await this.calculateCartAmount(processedProducts),
        purchaser: request.user.email,
        products: processedProducts.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        productWithoutStock: discardedProducts.map((item) => ({
          product: item,
        })),
      };

      const saveTicket = await ticketModel.create(newTicket);

      cart.ticket = saveTicket._id;

      await cartModel.findByIdAndUpdate({ _id: cart._id }, cart);

      const getTicket = await this.getTicketById(saveTicket._id);

      return getTicket;
    } else {
      return (this.error = { error: "We do not have any products :(" });
    }
  };
}
