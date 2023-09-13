import EErrors from "../../services/errors/errorHandler.dictionary.js";

export default (error, request, response, next) => {
  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      response.send({ status: "error", error: error.name });
      break;
    default:
      response.send({ status: "error", error: "Unhandled error" });
  }
};
