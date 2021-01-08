import {Response} from 'express';
import multer, {FileFilterCallback, MulterError} from 'multer';
import jimp from 'jimp';
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import { getConnection } from 'typeorm';

import { Account, Profile } from '../../../db';

import { respondWithSuccess, respondWithWarning } from '../../../lib/httpResponse';

const baseUrl = process.env.BASE_URL;

const MAX_IMAGE_SIZE = 1048576;

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
    cb(null, './public/uploads');
  },
    filename: (_req, file, cb) => {
      cb(null, `${file.fieldname}-${uuidv4()}${path.extname(file.originalname.toLowerCase())}`);
    }
  });

const checkFileType = (_req: any, file: Express.Multer.File, cb: FileFilterCallback) => {

  const fileTypes = /jpeg|jpg|png|JPEG|JPG|PNG|Jpeg|Jpg|Png/;

  const extname = fileTypes.test(path.extname(file.originalname.toLowerCase()));

  const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
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

const imageUpload = async (req: any, res: Response) => {
  const id = req.decoded!.id;

  upload(req, res, async (err: any) => {
    if (err instanceof MulterError){
      return respondWithWarning(res, 400, err.message);
    }
    if (!req.file){
      return respondWithWarning(res, 400, 'No image selected');
    }
    if (req.file.size > MAX_IMAGE_SIZE){
      return respondWithWarning(res, 400, 'Image too large');
    }

    try {
      const image = await jimp.read(req.file.path);
      image.resize(128, 128)
       .quality(100)
       .write(req.file.path);
    } catch (error) {
        return respondWithWarning(res, 400, 'Error occured resizing image, Please try again');
    }

    const account = await Account.findOne({
      where: {
        id
      }
    });

    if (!account){
      return respondWithWarning(res, 403, 'Image upload not allowed');
    }
    await getConnection()
      .createQueryBuilder()
      .update(Profile)
      .set({imageUrl: `${baseUrl}/${req.file.path.toLowerCase()}`})
      .where('id = :id', {id: account.profile.id})
      .execute();
    return respondWithSuccess(res, 200, 'Profile image uploaded successfully');
  });
};

export default imageUpload;
