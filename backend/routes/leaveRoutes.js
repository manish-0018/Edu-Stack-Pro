const express = require('express');
const router = express.Router();
const {
  createLeaveRequest,
  getLeaveRequests,
  updateLeaveStatus
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('student'), createLeaveRequest)
  .get(protect, getLeaveRequests);

router.route('/:id')
  .put(protect, authorize('teacher', 'admin'), updateLeaveStatus);

module.exports = router;
