import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  password: { type: String },
  carts: {
    type: [
      {
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "carts",
        },
      },
    ],
    default: [],
  },
  role: { type: String, default: "user" },
  isActive: { type: Boolean, default: true },
  hasAuthenticationMethod: { type: Boolean, default: false },
  authCode: { type: String, default: '' },
});

/**
 * Middleware for populate the searchs
 */
userSchema.pre("find", function () {
  this.populate("carts.cart");
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
