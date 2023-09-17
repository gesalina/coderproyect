export const generateUserError = (user) => {
  return `One or more properties were incomplete or not valid.
    List of required properties:
    * first_name: needs to be a String, received ${user.first_name}
    * last_name: needs to be a String, received ${user.last_name}
    * email: needs to be a String, received ${user.email}
    * age: need to be a Number, received ${user.age}
    `;
};

export const generateProductError = (product) => {
  return `One or more properties were incomplete or not valid.
    List of required properties:
    * title: needs to be a String, received ${product.title}
    * description: needs to be a String, received ${product.description}
    * price: needs to be a Number, received ${product.price}
    * thumbnail: need to be a String, received ${product.thumbnail},
    * code: need to be a String, received ${product.code},
    * stock: need to be a Number, received ${product.stock}
    `;
};

export const deleteProductError = (product) => {
  return `The propertie ${product.id} is incompleted or not valid.`;
};
