const express = require('express');
const router = express.Router();
const { getMyNotifications, markAsRead, markAllAsRead, createNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMyNotifications)
  .post(protect, createNotification);

router.route('/readAll')
  .put(protect, markAllAsRead);

router.route('/:id/read')
  .put(protect, markAsRead);

module.exports = router;
