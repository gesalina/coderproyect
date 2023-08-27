import Product from "../services/products.service.js";

/**
 * Initializate product service
 */
const productService = new Product();

export const getProductsController = async (request, response) => {
  try {
    const result = await productService.getProducts(request);
    console.log(result);
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const getProductsByIdController = async (request, response) => {
  let id = request.params.pid;
  try {
    const result = await productService.getProductsById(id);
    if (result.error) {
      return response.sendRequestError(result.error);
    }
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const createProductController = async (request, response) => {
  let product = request.body;
  try {
    const result = await productService.createProduct(product, request);
    request.app.get("socketio").emit("updateProducts", result);
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const deleteProductController = async (request, response) => {
  let id = request.params.pid;
  try {
    const result = await productService.deleteProduct(id);
    if (result.error) {
      return response.sendRequestError(result.error);
    }
    response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const updateProductController = async (request, response) => {
  let id = request.params.pid;
  let data = request.body;
  if (Object.keys(data).length < 7)
    return response.sendRequestError("All the fields are needed");

  try {
    const result = await productService.updateProduct(id, data);
    if (result.error) {
      return response.sendRequestError(result.error);
    }
    response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};
