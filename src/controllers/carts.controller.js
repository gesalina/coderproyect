import cartManager from "../../src/dao/fsManager/CartManager.js";
const cart = new cartManager();

export const getCartsController = async (request, response) => {
  try {
    const getCarts = await cart.getCarts();
    return response.json({ carts: getCarts });
  } catch (error) {
    return response.status(404).json({ status: "error", error: error });
  }
};

export const getCartProductsController = async (request, response) => {
  const cartId = request.params.cid;
  try {
    const getProductsCarts = await cart.getCartProduct(cartId);
    if (getProductsCarts.error) {
      return response
        .status(404)
        .json({ status: "error", error: getProductsCarts.error });
    }
    response.json({ payload: getProductsCarts });
  } catch (error) {
    return response.status(404).json({ status: "error", error: error });
  }
};

export const findCartByIdController = async (request, response) => {
  const cartId = request.params.cid;
  try {
    const getCart = await cart.findCartById(cartId);
    if (getCart.error) {
      return response
        .status(404)
        .json({ status: "error", error: getCart.error });
    }
    response.json({ cart: getCart });
  } catch (error) {
    return response.status(404).json({ status: "error", error: error });
  }
};

export const createCartController = async (request, response) => {
  try {
    let response = await cart.createCart();
    response.json({ message: "Carrito creado satisfactoriamente" });
  } catch (error) {
    return response.status(404).json({ status: "error", error: error });
  }
};

export const deleteProductController = async (request, response) => {
  const cartId = request.params.cid;
  const productId = request.params.pid;
  try {
    const deleteCartProduct = await cart.deleteProduct(cartId, productId);
    if (deleteCartProduct.error) {
      return response
        .status(404)
        .json({ status: "error", error: deleteCartProduct.error });
    }
    response.json({ status: "success", payload: deleteCartProduct });
  } catch (err) {
    response.status(404).json({ status: "error", error: err.message });
  }
};

export const updateCartController = async (request, response) => {
  const cartId = request.params.cid;
  const { product, quantity } = request.body;
  try {
    const updateCart = await cart.addProductCart(cartId, product, quantity);
    if (updateCart.error) {
      return response
        .status(404)
        .json({ status: "error", error: updateCart.error });
    }
    response.status(200).json({ status: "success", payload: updateCart });
  } catch (error) {
    response.status(404).json({ status: "error", error: error });
  }
};

export const updateProductController = async (request, response) => {
  const cartId = request.params.cid;
  const productId = request.params.pid;
  const { quantity } = request.body;
  try {
    const updateProduct = await cart.updateProductQuantity(
      cartId,
      productId,
      quantity
    );
    if (updateProduct.error) {
      return response
        .status(404)
        .json({ status: "error", error: updateProduct.error });
    }
    response.status(200).json({ status: "success", payload: updateProduct });
  } catch (error) {
    response.status(404).json({ status: "error", error: error });
  }
};

export const emptyCartProductController = async (request, response) => {
  const cartId = request.params.cid;
  try {
    const deleteProducts = await cart.deleteAllProducts(cartId);
    if (deleteProducts.error || deleteProducts.modifiedCount == 0) {
      return response
        .status(404)
        .json({ status: "error", error: deleteProducts.error });
    }
    response.status(200).json({ status: "success", payload: deleteProducts });
  } catch (error) {
    response.status(404).json({ status: "error", error: error });
  }
};
