import { fakerES as faker } from "@faker-js/faker";

export const productSeeder = (numOfProducts) => {
  let products = [];

  for (let i = 0; i < numOfProducts; i++) {
    products.push(generateProduct());
  }
  return products
};

export const generateProduct = () => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnail: faker.image.avatar(),
    code: faker.string.alphanumeric(10),
    status: true,
    stock: faker.string.numeric(1),
  };
};
