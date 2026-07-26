const express = require('express');
const router = express.Router();
const { getHolidays, createHoliday, deleteHoliday } = require('../controllers/calendarController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getHolidays)
  .post(protect, authorize('admin'), createHoliday);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteHoliday);

module.exports = router;
