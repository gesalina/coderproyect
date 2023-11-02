import { productModel } from "../dao/models/product.model.js";
import userModel from "../dao/models/user.model.js";

export default class Product {
  constructor() {
    this.error = "";
  }
  /**
   * This function get all the product from our collection
   */
  getProducts = async (request) => {
    try {
      const limit = parseInt(request.query.limit) || 10;
      const page = parseInt(request.query.page) || 1;
      const sort = request.query.sort === "desc" ? -1 : 1;
      const query = request.query.query || {};
      let options;

      request.query.sort
        ? (options = {
            page,
            limit,
            sort,
            lean: true,
            leanWithId: false,
          })
        : (options = { page, limit, lean: true, leanWithId: false });

      const filter = {};

      if (query.category) filter.category = query.category;
      if (query.availability) filter.availability = query.availibility;

      const products = await productModel.paginate(filter, options);
      return {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage
          ? `https://coderproyect-production.up.railway.app/products?page=${products.prevPage}&limit=${products.limit}`
          : null,
        nextLink: products.hasNextPage
          ? `https://coderproyect-production.up.railway.app/products?page=${products.nextPage}&limit=${products.limit}`
          : null,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  /**
   * This function find a product by ID
   */
  getProductsById = async (productId) => {
    try {
      const product = await productModel.find({
        _id: productId,
      });
      if (!product || product <= 0) {
        return (this.error = { error: "Product not found" });
      }
      return product;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  /**
   * This function create a new product
   * La funcion ID va a ser deprecada en la siguiente version
   */
  createProduct = async (product) => {
    try {
      const result = await productModel.create({
        ...product,
      });
      return result;
    } catch (error) {
      return (this.error = { error: error.message });
    }
  };

  createManyProducts = async (product) => {
    try {
      const result = await productModel.insertMany(product);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  /**
   * This function delete a specific ID
   */
  deleteProduct = async (request) => {
    const id = request.params.pid;
    const { email } = request.body;
    try {
      const product = await productModel.findById({ _id: id }).lean();

      const findUser = await userModel
        .findOne({ email: email, role: "admin" })
        .lean();

      if (findUser || email === product.owner) {
        const result = await productModel.findOneAndDelete({
          _id: id,
        });
        return result;
      } else {
        return (this.error = {
          error: "Cant delete this product because you are not owner",
        });
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  /**
   * This function update a specific product
   */
  updateProduct = async (productId, data) => {
    try {
      const result = await productModel.findOneAndUpdate(
        { _id: productId },
        data
      );
      if (!result || result <= 0) {
        return (this.error = { error: `Cant update a inexistent ID` });
      }
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
