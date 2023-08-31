import { productRepository } from "../repositories/repository.js";

export const redirectLoginController = async (request, response) => {
  response.redirect("/session/login");
};

export const realTimeProductsController = async (request, response) => {
  const products = await productRepository.getProducts(request);
  response.render("realTimeProducts", {
    view_name: "Productos en tiempo real",
    products: products.docs,
  });
};

export const chatController = async (request, response) => {
  response.render("chat");
};

export const productsController = async (request, response) => {
  const products = await productRepository.getProducts(request);
  return response.render("products", {
    plugins: "?plugins=aspect-ratio",
    view_name: "Products View",
    showCart: true,
    username: request.user.user.first_name,
    role: request.user.user.role,
    products: products.docs,
    prevLink: products.hasPrevPage
      ? `http://localhost:8080?page=${products.prevPage}&limit=${products.limit}`
      : null,
    nextLink: products.hasNextPage
      ? `http://localhost:8080?page=${products.nextPage}&limit=${products.limit}`
      : null,
  });
};
