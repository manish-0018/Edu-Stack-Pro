const express = require('express');
const router = express.Router();
const { getMyNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMyNotifications);

router.route('/readAll')
  .put(protect, markAllAsRead);

router.route('/:id/read')
  .put(protect, markAsRead);

module.exports = router;
