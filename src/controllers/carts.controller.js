import {cartRepository} from "../repositories/repository.js";
import Cart from "../services/cart.service.js";
const cartService = new Cart();

export const getCartsController = async (request, response) => {
  try {
    const result = await cartRepository.getCarts();
        return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const getCartProductsController = async (request, response) => {
  const cartId = request.params.cid;
  try {
    const result = await cartRepository.getCartProduct(cartId);
    if (result.error) {
      return response
        .status(404)
        .json({ status: "error", error: result.error });
    }
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const findCartByIdController = async (request, response) => {
  const cartId = request.params.cid;
  try {
    const result = await cartRepository.findCartById(cartId);
    if (result.error) {
      return response
        .status(404)
        .json({ status: "error", error: result.error });
    }
     return response.sendSuccess(result);
  } catch (error) {
      return response.sendServerError(error.message);
  }
};

export const createCartController = async (request, response) => {
  const {userId} = request.body;
  try {
    const result = await cartReposity.createCart(userId);
         return response.sendSuccess(result);

  } catch (error) {
          return response.sendServerError(error.message);

  }
};

export const deleteProductController = async (request, response) => {
  const cartId = request.params.cid;
  const productId = request.params.pid;
  try {
    const result = await cartRepository.deleteProductFromCart(cartId, productId);
    if (result.error) {
      return response
        .status(404)
        .json({ status: "error", error: result.error });
    }
         return response.sendSuccess(result);

  } catch (error) {
          return response.sendServerError(error.message);
  }
};

export const updateCartController = async (request, response) => {
  const cartId = request.params.cid;
  const { product, quantity } = request.body;
  try {
    const result = await cartRepositoy.addProductCart(cartId, product, quantity)
    if (result.error) {
      return response
        .status(404)
        .json({ status: "error", error: result.error });
    }
         return response.sendSuccess(result);
  } catch (error) {
          return response.sendServerError(error.message);
  }
};

export const updateProductController = async (request, response) => {
  const cartId = request.params.cid;
  const productId = request.params.pid;
  const { quantity } = request.body;
  try {
    const result = await cartReposity.updateProductQuantity(cartId, productId, quantity)
    if (result.error) {
      return response
        .status(404)
        .json({ status: "error", error: result.error });
    }
         return response.sendSuccess(result);
  } catch (error) {
          return response.sendServerError(error.message);
  }
};

export const emptyCartProductController = async (request, response) => {
  const cartId = request.params.cid;
  try {
    const result = await cartRepository.deleteAllProducts(cartId);
    if (result.error || result.modifiedCount == 0) {
      return response
        .status(404)
        .json({ status: "error", error: result.error });
    }
         return response.sendSuccess(result);
  } catch (error) {
          return response.sendServerError(error.message);
  }
};
