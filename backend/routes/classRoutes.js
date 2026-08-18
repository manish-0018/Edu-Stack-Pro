const express = require('express');
const router = express.Router();
const {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
} = require('../controllers/classController');
const { protect, optionalProtect, authorize } = require('../middleware/authMiddleware');

// Anyone (including guests registering) can read class names (optionally scoped if logged in)
router.route('/')
  .get(optionalProtect, getClasses)
  .post(protect, authorize('admin'), createClass);

router.route('/:id')
  .put(protect, authorize('admin'), updateClass)
  .delete(protect, authorize('admin'), deleteClass);

module.exports = router;
