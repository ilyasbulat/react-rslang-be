const multer = require('multer');
const uuid = require('uuid/v1');

const MIME_TYPES_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public');
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPES_MAP[file.mimetype];
      cb(null, `${uuid()}.${ext}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPES_MAP[file.mimetype];
    const error = isValid ? null : new Error('Invalid mimetype');
    cb(error, isValid);
  }
});

module.exports = fileUpload;
