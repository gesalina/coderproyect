import multer from "multer";

const dynamicFolder = (request, file, cb) => {
  const folderName = request;
  const uploadPath = `/public/${folderName}`;

  cb(null, uploadPath);
};

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "coderproyect" + `/public/map/`);
    console.log(request.body.customPath)
  },
  filename: function (request, file, cb) {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });
