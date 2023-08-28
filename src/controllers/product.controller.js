import { productRepository } from "../repositories/repository.js";

export const getProductsController = async (request, response) => {
  try {
    const result = await productRepository.getProducts(request)
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const getProductsByIdController = async (request, response) => {
  let id = request.params.pid;
  try {
    const result = await productRepository.getProductsById(id);
    if (result.error) {
      return response.sendRequestError(result.error);
    }
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

/**
 * This controller create a new product
 * validate every field
 */
export const createProductController = async (request, response) => {
  let product = request.body;
  try {
    const getProducts = await productRepository.getProducts(request);
    const result = await productRepository.createProduct(product);
    request.app.get("socketio").emit("updateProducts", getProducts.payload);
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const deleteProductController = async (request, response) => {
  let id = request.params.pid;
  try {
    const result = await productRepository.deleteProduct(id);
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
    const result = await productRepository.updateProduct(id, data);
    if (result.error) {
      return response.sendRequestError(result.error);
    }
    response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};
