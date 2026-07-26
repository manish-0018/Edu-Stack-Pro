const express = require('express');
const router = express.Router();
const { getUsers, updateUser, sendWarningEmail, deleteUser, getResumeData, getGuardianStudent } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me/resume-data', protect, getResumeData);
// guardian route removed – guardians no longer accessed via this endpoint

router.route('/')
  .get(protect, authorize('admin', 'teacher'), getUsers);

router.route('/:id')
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

router.route('/:id/send-warning')
  .post(protect, authorize('admin', 'teacher'), sendWarningEmail);

module.exports = router;
