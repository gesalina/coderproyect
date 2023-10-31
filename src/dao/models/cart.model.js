import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    default: [],
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId
  }
});

mongoose.set("strictPopulate", false);
/**
 * Middleware for populate the searchs
 */
cartSchema
  .pre("find", function () {
    this.populate("products.product");
  })
  .pre("find", function () {
    this.populate("users");
  });

export const cartModel = mongoose.model(cartCollection, cartSchema);
