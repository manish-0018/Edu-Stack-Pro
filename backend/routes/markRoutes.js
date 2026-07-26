const express = require('express');
const router = express.Router();
const { getMarks, upsertMarks } = require('../controllers/markController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMarks)
  .post(protect, authorize('teacher'), upsertMarks);

module.exports = router;
