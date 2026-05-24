const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .sort('-createdAt');

    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers };
