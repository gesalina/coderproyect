import {
  cartRepository,
  ticketRepository,
} from "../repositories/repository.js";
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
      return response.sendRequestError(result.error);
    }
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const findCartByIdController = async (request, response) => {
  const cartId = request.params.cid;
  try {
    const result = await cartRepository.getCartById(cartId);
    if (result.error) {
      return response.sendRequestError(result.error);
    }
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const createCartController = async (request, response) => {
  const { userId } = request.body;
  try {
    const result = await cartRepository.createCart(userId);
    if (result.error) {
      return response.sendRequestError(result.error);
    }
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const deleteProductController = async (request, response) => {
  const cartId = request.params.cid;
  const productId = request.params.pid;
  try {
    const result = await cartRepository.deleteProductFromCart(
      cartId,
      productId
    );
    if (result.error) {
      return response.sendRequestError(result.error);
    }
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const updateCartController = async (request, response) => {
  const cartId = request.params.cid;
  const { product, quantity, email } = request.body;
  try {
    const result = await cartRepository.addProductCart(
      cartId,
      product,
      quantity,
      email
    );
    if (result.error) {
      return response.sendRequestError(result.error);
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
    const result = await cartRepository.updateProductQuantity(
      cartId,
      productId,
      quantity
    );
    if (result.error) {
      return response.sendRequestError(result.error);
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
      return response.sendRequestError(result.error);
    }
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const finishPurchaseController = async (request, response) => {
  const cartId = request.params.cid;
  try {
    const result = await ticketRepository.finishPurchase(request, cartId);
    return response.sendSuccess(result);
  } catch (error) {
    console.log(error);
  }
};

export const viewCart = async (request, response) => {
  const cartId = request.params.cid;
  const res = await cartRepository.getCartById(cartId);
  let savethis = []
  res.products.forEach(items => {
    return savethis.push({
      title: items.product.title,
      quantity: items.quantity,
      code: items.product.code,
      thumbnail: items.product.thumbnail,
      total: items.quantity * items.product.price,
    })
  })
  response.render('cart', {
    plugins: "?plugins=aspect-ratio",
    view_name: "My cart",
    isAuth: true,
    items: savethis
  })
};
