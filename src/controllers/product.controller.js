import { productRepository } from "../repositories/repository.js";
import { productSeeder } from "../seeder/productSeeder.js";
import handleError from "../services/errors/errorHandler.service.js";
import EErrors from "../services/errors/errorHandler.dictionary.js";
import { generateProductError } from "../services/errors/messages/errorMessages.js";
import logger from "../middlewares/logger/logger.middleware.js";

export const getProductsController = async (request, response) => {
  try {
    const result = await productRepository.getProducts(request);
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
  if (
    !product.title ||
    !product.description ||
    !product.price ||
    !product.thumbnail ||
    !product.code
  ) {
    return handleError.createError({
      name: "Product creation error",
      cause: generateProductError(product),
      message: "Error trying to create the product",
      code: EErrors.INVALID_PRODUCT_ERROR,
    });
  }
  try {
    const getProducts = await productRepository.getProducts(request);
    const result = await productRepository.createProduct(product);
    if (result.error) return response.sendServerError(result.error);
    request.app.get("socketio").emit("updateProducts", getProducts.payload);
    return response.sendSuccess(result);
  } catch (error) {
    logger.fatal("Error trying to create a product");
    return response.sendServerError(error.message);
  }
};

export const deleteProductController = async (request, response) => {
  try {
    const result = await productRepository.deleteProduct(request);
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
  let product = request.body;

  if (
    !product.title ||
    !product.description ||
    !product.price ||
    !product.thumbnail ||
    !product.stock ||
    !product.code
  ) {
    return handleError.createError({
      name: "Product update error",
      cause: generateProductError(product),
      message: "Error trying to update the product",
      code: EErrors.INVALID_PRODUCT_ERROR,
    });
  }
  try {
    const result = await productRepository.updateProduct(id, product);
    if (result.error) {
      return response.sendRequestError(result.error);
    }
    response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};

export const seederProductController = async (request, response) => {
  try {
    const result = await productRepository.createManyProducts(productSeeder(2));
    return response.sendSuccess(result);
  } catch (error) {
    return response.sendServerError(error.message);
  }
};
