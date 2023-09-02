import ProductValidator from "../dao/dto/product.dto.js";
export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getProducts = async (request) => {
    const result = await this.dao.getProducts(request);
    return result;
  };

  getProductsById = async (request) => {
    const result = await this.dao.getProductsById(request);
    return result;
  };

  deleteProduct = async (request) => {
    const result = await this.dao.deleteProduct(request);
    return result;
  };

  createProduct = async (request, response) => {
    const validate = new ProductValidator(request);
    const result = await this.dao.createProduct(validate, response);
    return result;
  };

  updateProduct = async (id, request) => {
    const validate = new ProductValidator(request);
    const result = await this.dao.updateProduct(id, validate);
    return result;
  };

  createManyProducts = async (request) => {
    const result = await this.dao.createManyProducts(request);
    return result;
  };
}
