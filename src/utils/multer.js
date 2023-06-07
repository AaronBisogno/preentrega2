import multer from 'multer';
import { __dirname } from './path.js';
import path from 'path'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public'));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname);
  },
});

export const upload = multer({ storage: storage })