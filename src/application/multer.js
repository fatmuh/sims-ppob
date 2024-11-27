import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {ResponseError} from "../error/response-error.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/profile-images/');
    },
    filename: (req, file, cb) => {
        const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFileName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        return cb(new ResponseError(102, 400, "Format Image tidak sesuai"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export default upload;