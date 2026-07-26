const express = require('express');
const router = express.Router();
const { getTimetable, createTimetableSlot, deleteTimetableSlot } = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTimetable)
  .post(protect, authorize('admin'), createTimetableSlot);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteTimetableSlot);

module.exports = router;
