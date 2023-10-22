import multer from "multer";
import Auth from "../services/auth.service.js";

const auth = new Auth();

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    let customPaths = {
      profile: "profiles",
      document: "documents",
      product: "products",
    };
    if (!customPaths[request.body.customPath])
      return cb(null, false, new Error("Sorry that router does not exist"));

    cb(null, `public/img/${customPaths[request.body.customPath]}`);
  },
  filename: function (request, file, cb) {
    cb(null, file.originalname);
  },
});

export const uploader = multer({
  storage
});
