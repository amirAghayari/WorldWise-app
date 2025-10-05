const multer = require('multer');
const fs = require('fs');
const path = require('path');
const AppError = require('./../utils/appError');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed!', 400), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB limit
});

exports.uploadImage = upload.single('avatar');

exports.handleImageUpload = (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded! ', 400));
  res.status(200).json({
    status: 'success',
    file: req.file,
  });
};
