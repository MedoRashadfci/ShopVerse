const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.route('/')
  .post(protect, createOrder)
  .get(protect, adminOnly, getOrders);

router.route('/my-orders')
  .get(protect, getMyOrders);

router.route('/:id/status')
  .patch(protect, adminOnly, updateOrderStatus);

module.exports = router;
