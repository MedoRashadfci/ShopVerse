const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors and return 400
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

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  validate,
];

const resetPasswordValidation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
