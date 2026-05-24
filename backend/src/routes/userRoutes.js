const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', protect, adminOnly, getUsers);

module.exports = router;
