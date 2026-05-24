const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { hashResetToken, generateResetToken } = require('../utils/resetToken');

const RESET_EXPIRE_MS = 15 * 60 * 1000; // 15 minutes
const GENERIC_RESET_MESSAGE =
  'If that email is registered, password reset instructions have been sent.';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          token: generateToken(updatedUser._id),
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email is already in use' });
    }
    next(error);
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const resetToken = generateResetToken();
      user.resetPasswordToken = hashResetToken(resetToken);
      user.resetPasswordExpire = Date.now() + RESET_EXPIRE_MS;
      await user.save({ validateBeforeSave: false });

      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

      if (process.env.NODE_ENV !== 'production') {
        console.log('[Password Reset]', resetUrl);
      }

      // Dev only: expose link for testing without email service
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          success: true,
          message: GENERIC_RESET_MESSAGE,
          resetUrl,
        });
      }
    }

    res.json({ success: true, message: GENERIC_RESET_MESSAGE });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = hashResetToken(req.params.token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset link. Please request a new one.',
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful. You can now sign in.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
};
