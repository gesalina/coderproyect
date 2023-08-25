import ProductManager from "../../src/dao/fsManager/ProductManager.js";

const productDatabase = new ProductManager();

export const getProductsController = async (request, response) => {
  try {
    const getProducts = await productDatabase.getProducts(request);
    response.json({
      status: "success",
      payload: getProducts.docs,
      totalPages: getProducts.totalPages,
      prevPage: getProducts.prevPage,
      nextPage: getProducts.nextPage,
      page: getProducts.page,
      hasPrevPage: getProducts.hasPrevPage,
      hasNextPage: getProducts.hasNextPage,
      prevLink: getProducts.hasPrevPage
        ? `http://localhost:8080?page=${getProducts.prevPage}&limit=${getProducts.limit}`
        : null,
      nextLink: getProducts.hasNextPage
        ? `http://localhost:8080?page=${getProducts.nextPage}&limit=${getProducts.limit}`
        : null,
    });
  } catch (error) {
    return response.status(404).json({ status: "error", error: error });
  }
};

export const getProductsByIdController = async(request, response) => {
    let id = request.params.pid;
    try {
      const mongoProducts = await productDatabase.findProductById(id);
      if (mongoProducts.error) {
        return response
          .status(404)
          .json({ status: "error", error: `${mongoProducts.error}` });
      }
      return response.json({ products: mongoProducts });
    } catch (error) {
      return response.status(404).json({ status: "error", error: error });
    }
}

export const createProductController = async(request, response) => {
    let product = request.body;
    try {
      const mongoProducts = await productDatabase.createProduct(product, request);
      request.app.get("socketio").emit("updateProducts", mongoProducts);
      response.json({ status: "success", products: mongoProducts });
    } catch (error) {
      response.status(404).json({ status: "error", error: error });
    }
}

export const deleteProductController = async(request, response) => {
    let id = request.params.pid;
    try {
      const mongoProducts = await productDatabase.deleteProduct(id);
      if (mongoProducts.error) {
        return response
          .status(404)
          .json({ status: "error", error: `${mongoProducts.error}` });
      }
      response.json({ status: "success", products: mongoProducts });
    } catch (err) {
      response.status(404).json({ status: "error", error: `${err.message}` });
    }
}

export const updateProductController = async (request, response) => {
    let id = request.params.pid;
    let data = request.body;
    if (Object.keys(data).length < 7)
      return response
        .status(404)
        .json({ status: "error", error: "All the fields are needed" });
  
    try {
      const mongoProducts = await productDatabase.updateProduct(id, data);
      if (mongoProducts.error) {
        return response
          .status(404)
          .json({ status: "error", error: `${mongoProducts.error}` });
      }
      response.json({ status: "success", products: mongoProducts });
    } catch (err) {
      response.status(404).json({ status: "error", error: `${err.message}` });
    }
  }
