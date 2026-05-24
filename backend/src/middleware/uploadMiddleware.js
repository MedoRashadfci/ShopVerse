const multer = require('multer');

// Store file in memory to upload to cloudinary buffer later
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Please upload an image file'), false);
  }
  
  // Accept specific extensions
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;
