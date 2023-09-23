import mongoose from "mongoose";

const tokenCollection = "token";

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users"
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  }
});

const TokenModel = mongoose.model(tokenCollection, tokenSchema);

export default TokenModel;
