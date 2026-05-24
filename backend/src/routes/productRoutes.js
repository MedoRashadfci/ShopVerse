const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { productValidation, productUpdateValidation } = require('../validations/productValidation');

router.route('/')
  .get(getProducts)
  .post(protect, adminOnly, upload.single('image'), productValidation, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, upload.single('image'), productUpdateValidation, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;
