import {Request, Response} from 'express';
import multer, {FileFilterCallback, MulterError} from 'multer';
// import cloud from 'cloudinary';
// import jimp from 'jimp';
// import uuid from 'uuid';
import path from 'path';
import { respondWithSuccess, respondWithWarning } from '../../../lib/httpResponse';

const MAX_IMAGE_SIZE = 1048576;

const storage = multer.diskStorage({
  destination: (req: Request, _file, cb) => {
    cb(null, '/uploads');
  },
  filename: (_req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

const checkFileType = (req: Request, file: {originalname: string, mimetype: string}, cb: FileFilterCallback) => {
  const fileTypes = /jpg|jpeg|png/;
  const extName = fileTypes.test(path.extname(file.originalname.toLowerCase()));
  const mimeType = fileTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  }
  return cb({message: 'Images only', name: 'Unknown file type'});
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE
  },
  fileFilter: (req, file, cb) => {
    checkFileType(req, file, cb);
  }
}).single('image');

export const imageUpload = (req:Request, res: Response) => {
  upload(req, res, (err: any) => {
    if (err instanceof MulterError){
      return respondWithWarning(res, 400, err.message);
    }
    if (!req.file){
      return respondWithWarning(res, 400, 'No image selected');
    }
    console.log(req.path);
  });
};
