const express = require('express');
const router = express.Router();
const {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
} = require('../controllers/classController');
const {
  startSession,
  rotateSessionCodes,
  endSession,
  checkIn
} = require('../controllers/attendanceSessionController');
const { protect, optionalProtect, authorize } = require('../middleware/authMiddleware');

// Anyone (including guests registering) can read class names (optionally scoped if logged in)
router.route('/')
  .get(optionalProtect, getClasses)
  .post(protect, authorize('admin'), createClass);

router.route('/:id')
  .put(protect, authorize('admin'), updateClass)
  .delete(protect, authorize('admin'), deleteClass);

// Attendance Session & Geofenced Check-In
router.post('/:id/start-session', protect, authorize('teacher'), startSession);
router.post('/:id/rotate-codes', protect, authorize('teacher'), rotateSessionCodes);
router.post('/:id/end-session', protect, authorize('teacher'), endSession);
router.post('/:id/check-in', protect, checkIn);

module.exports = router;
