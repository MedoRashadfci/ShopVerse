const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array().map((err) => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

const productValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ min: 3 }).withMessage('Title must be at least 3 characters').trim(),
  body('description').notEmpty().withMessage('Description is required').trim(),
  body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category ID is required').isMongoId().withMessage('Invalid Category ID format'),
  body('stock').notEmpty().withMessage('Stock is required').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  validate
];

const productUpdateValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty').isLength({ min: 3 }).withMessage('Title must be at least 3 characters').trim(),
  body('description').optional().notEmpty().withMessage('Description cannot be empty').trim(),
  body('price').optional().isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
  body('category').optional().isMongoId().withMessage('Invalid Category ID format'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  validate,
];

module.exports = {
  productValidation,
  productUpdateValidation,
};
