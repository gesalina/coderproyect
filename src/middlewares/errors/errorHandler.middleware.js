import EErrors from "../../services/errors/errorHandler.dictionary.js";

export default (error, request, response, next) => {
  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      response.status(400).json({ status: "error", error: error.name });
      break;
    case EErrors.INVALID_PRODUCT_ERROR:
    case EErrors.INVALID_CART_ERROR:
      response.status(404).json({ status: "error", error: error.name });
      break;
    default:
      response.status(500).json({ status: "error", error: "Unhandled error" });
      break;
  }
};
