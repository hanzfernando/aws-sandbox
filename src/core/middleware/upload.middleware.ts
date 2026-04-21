import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(null, false);
    }
    cb(null, true);
  }
});

export const uploadMiddleware = upload.single('avatar');