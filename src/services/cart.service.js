import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "../dao/models/product.model.js";
import userModel from "../dao/models/user.model.js";

export default class Cart {
  constructor() {
    this.error = "";
  }
  /**
   * This function get all the product from our collection
   */
  /**
   * Get the carts
   */
  getCarts = async () => {
    try {
      const carts = await cartModel.find().lean();
      return carts;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  /**
   * Find a cart by ID
   */
  getCartById = async (cartId) => {
    try {
      const cart = await cartModel.find({ id: cartId });
      if (!cart || cart <= 0) {
        return (this.error = { error: "Cart not found" });
      }
      return cart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  /**
   * Create a new cart
   */
  createCart = async (user) => {
    const generateId = await this.createtId();
    try {
      const result = await cartModel.create({ id: generateId, userId: user });
      const find = await userModel.findOne({ id: user });
      find.carts.push({ cart: result._id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  /**
   * Get the products of a cart
   */
  getCartProduct = async (cartId) => {
    try {
      const cartProducts = await cartModel
        .find({ id: cartId })
        .select("products");
      if (!cartProducts || cartProducts.products <= 0)
        return (this.error = { error: "This cart dont have products" });
      return cartProducts;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  /**
   * Delete a product from a specific cart
   */
  deleteProductFromCart = async (cartId, productId) => {
    try {
      const productData = await productModel.findOne({ id: productId });
      const deleteProduct = await cartModel.updateOne(
        { id: cartId },
        { $pull: { products: { product: productData._id } } }
      );
      if (!deleteProduct || deleteProduct.modifiedCount == 0)
        return (this.error = {
          error: "That product does not exist in this cart",
        });
      return deleteProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  /**
   * Update the cart with a array of products
   */
  addProductCart = async (cartId, productId, quantity) => {
    try {
      const cart = await cartModel.findOne({ id: cartId });
      const productData = await productModel.findOne({ id: productId });
      if (!cart) {
        return (this.error = { error: "This cart does not exists" });
      }
      if (!productData)
        return (this.error = { error: "The product ID does not exist" });
      cart.products.push({ product: productData._id, quantity: quantity });
      return await cartModel.updateOne({ cartId }, cart);
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  /**
   * Update the quantity of a product in a specific cart
   */
  updateProductQuantity = async (cartId, productId, quantity) => {
    try {
      const cart = await cartModel.findOne({ id: cartId });
      const productData = await productModel.findOne({ id: productId });
      if (!cart) {
        return (this.error = { error: "Cant find that cart" });
      }
      return cartModel.updateOne(
        { id: cartId, "products.product": productData._id },
        { $inc: { "products.$.quantity": quantity } }
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  /**
   * Delete all products from a cart
   */
  deleteAllProducts = async (cartId) => {
    try {
      const cart = await cartModel.findOne({ id: cartId });
      cartId = parseInt(cartId);
      if (!cart) {
        return (this.error = { error: "Cant find that cart" });
      }
      return await cartModel.updateOne(
        { id: cartId },
        { $set: { products: [] } }
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  /**
   * Create a UNIQUE ID for each cart
   */
  createtId = async () => {
    const getCartId = await this.getCarts();
    return getCartId.length === 0 ? 1 : getCartId.at(-1).id + 1;
  };

  /**
   * Finish the purchase
   */

  finishPurchase = async (request, cartId) => {
    const cart = await cartModel.findOne({
      id: cartId,
      userId: request.user._id.toHexString(),
    });

    if (!cart)
      return (this.error = { error: "You do not have a cart with this id" });

    let saveIds = [];

    /**
     * Iterate in each product of our cart
     */
    for(const product of cart.products){
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
      if (validateStock.stock < product.quantity) {

         saveIds.push(validateStock._id.toHexString());

      }
      /**
       * If the product have stock, update the product and decrement the stock
       * with the values: stock (product model) and quantity (cart model)
       */
      const updateStock = await productModel.updateOne(
        { _id: product.product.toHexString() },
        { $inc: { stock: -product.quantity } }
      );
    };

    return {
      message: 'Success purchase',
      productIdNonStock: saveIds,
      email: request.user.email
    }
    console.log(saveIds)
    // if (!validateCart) return (this.error = { error: "Cart not found" });
    // const validateStock = await productModel.findOne({ _id: getProductId });
  };
}
